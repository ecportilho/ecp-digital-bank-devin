import { getDatabase } from '../../database/connection.js'
import { AppError } from '../../shared/errors/app-error.js'
import { ErrorCode } from '../../shared/errors/error-codes.js'
import { generateId } from '../../shared/utils/uuid.js'
import type { SendPixInput, CreatePixKeyInput } from './pix.schemas.js'

const PIX_DAILY_LIMIT = 500000 // R$ 5.000,00 em centavos
const PIX_NIGHT_LIMIT = 100000 // R$ 1.000,00 em centavos

interface PixKeyRow {
  id: string
  account_id: string
  type: string
  value: string
  status: string
  created_at: string
}

interface AccountRow {
  id: string
  user_id: string
  balance: number
}

interface SumRow {
  total: number
}

function isNightTime(): boolean {
  const hour = new Date().getHours()
  return hour >= 20 || hour < 6
}

function getDailyPixTotal(accountId: string): number {
  const db = getDatabase()
  const today = new Date().toISOString().split('T')[0]
  const result = db.prepare(`
    SELECT COALESCE(SUM(ABS(amount)), 0) as total
    FROM transactions
    WHERE account_id = ? AND type = 'pix_sent' AND date(created_at) = ?
  `).get(accountId, today) as SumRow
  return result.total
}

export function sendPix(userId: string, input: SendPixInput) {
  const db = getDatabase()

  // Check idempotency
  if (input.idempotencyKey) {
    const existing = db.prepare(
      'SELECT id FROM transactions WHERE idempotency_key = ?'
    ).get(input.idempotencyKey)
    if (existing) {
      throw new AppError(ErrorCode.DUPLICATE_REQUEST, 'Transação já processada')
    }
  }

  // Get sender account
  const senderAccount = db.prepare(
    'SELECT id, user_id, balance FROM accounts WHERE user_id = ? AND deleted_at IS NULL'
  ).get(userId) as AccountRow | undefined

  if (!senderAccount) {
    throw new AppError(ErrorCode.NOT_FOUND, 'Conta não encontrada')
  }

  // Find receiver by Pix key
  const receiverKey = db.prepare(
    "SELECT account_id FROM pix_keys WHERE value = ? AND status = 'active'"
  ).get(input.keyValue) as { account_id: string } | undefined

  // Self-transfer check
  if (receiverKey && receiverKey.account_id === senderAccount.id) {
    throw new AppError(ErrorCode.SELF_TRANSFER_NOT_ALLOWED, 'Não é possível enviar Pix para si mesmo')
  }

  // Check balance
  if (senderAccount.balance < input.amount) {
    throw new AppError(ErrorCode.INSUFFICIENT_BALANCE, 'Saldo insuficiente')
  }

  // Night limit (RN-02)
  if (isNightTime() && input.amount > PIX_NIGHT_LIMIT) {
    throw new AppError(
      ErrorCode.PIX_NIGHT_LIMIT_EXCEEDED,
      'Limite noturno de Pix: R$ 1.000,00 por transação'
    )
  }

  // Daily limit (RN-01)
  const dailyTotal = getDailyPixTotal(senderAccount.id)
  if (dailyTotal + input.amount > PIX_DAILY_LIMIT) {
    throw new AppError(
      ErrorCode.PIX_DAILY_LIMIT_EXCEEDED,
      'Limite diário de Pix excedido (R$ 5.000,00)'
    )
  }

  const transactionId = generateId()

  const runTransaction = db.transaction(() => {
    // Debit sender
    db.prepare('UPDATE accounts SET balance = balance - ?, updated_at = datetime(\'now\') WHERE id = ?')
      .run(input.amount, senderAccount.id)

    // Credit receiver if found
    if (receiverKey) {
      db.prepare('UPDATE accounts SET balance = balance + ?, updated_at = datetime(\'now\') WHERE id = ?')
        .run(input.amount, receiverKey.account_id)

      // Receiver transaction
      db.prepare(`
        INSERT INTO transactions (id, account_id, type, amount, description, category)
        VALUES (?, ?, 'pix_received', ?, ?, 'transfer')
      `).run(generateId(), receiverKey.account_id, input.amount, input.description || 'Pix recebido')

      // Create notification for receiver
      const receiverAccount = db.prepare('SELECT user_id FROM accounts WHERE id = ?').get(receiverKey.account_id) as { user_id: string } | undefined
      if (receiverAccount) {
        db.prepare(`
          INSERT INTO notifications (id, user_id, title, body, type)
          VALUES (?, ?, 'Pix recebido', ?, 'pix_received')
        `).run(generateId(), receiverAccount.user_id, `Você recebeu R$ ${(input.amount / 100).toFixed(2)}`)
      }
    }

    // Sender transaction
    db.prepare(`
      INSERT INTO transactions (id, account_id, type, amount, description, category, idempotency_key)
      VALUES (?, ?, 'pix_sent', ?, ?, 'transfer', ?)
    `).run(transactionId, senderAccount.id, -input.amount, input.description || 'Pix enviado', input.idempotencyKey || null)
  })

  runTransaction()

  const updatedAccount = db.prepare('SELECT balance FROM accounts WHERE id = ?').get(senderAccount.id) as { balance: number }

  return {
    transactionId,
    amount: input.amount,
    description: input.description || 'Pix enviado',
    newBalance: updatedAccount.balance,
    createdAt: new Date().toISOString(),
  }
}

export function createPixKey(userId: string, input: CreatePixKeyInput) {
  const db = getDatabase()

  const account = db.prepare(
    'SELECT id FROM accounts WHERE user_id = ? AND deleted_at IS NULL'
  ).get(userId) as { id: string } | undefined

  if (!account) {
    throw new AppError(ErrorCode.NOT_FOUND, 'Conta não encontrada')
  }

  // Check limit (RN-05: max 5 keys)
  const keyCount = db.prepare(
    "SELECT COUNT(*) as count FROM pix_keys WHERE account_id = ? AND status = 'active'"
  ).get(account.id) as { count: number }

  if (keyCount.count >= 5) {
    throw new AppError(ErrorCode.PIX_KEY_LIMIT_REACHED, 'Limite de 5 chaves Pix atingido')
  }

  // Check if key already exists
  const existing = db.prepare(
    "SELECT id FROM pix_keys WHERE value = ? AND status = 'active'"
  ).get(input.value)

  if (existing) {
    throw new AppError(ErrorCode.PIX_KEY_ALREADY_EXISTS, 'Chave Pix já cadastrada')
  }

  const keyId = generateId()
  db.prepare(`
    INSERT INTO pix_keys (id, account_id, type, value, status)
    VALUES (?, ?, ?, ?, 'active')
  `).run(keyId, account.id, input.type, input.value)

  return {
    id: keyId,
    type: input.type,
    value: input.value,
    status: 'active',
    createdAt: new Date().toISOString(),
  }
}

export function listPixKeys(userId: string) {
  const db = getDatabase()

  const account = db.prepare(
    'SELECT id FROM accounts WHERE user_id = ? AND deleted_at IS NULL'
  ).get(userId) as { id: string } | undefined

  if (!account) {
    throw new AppError(ErrorCode.NOT_FOUND, 'Conta não encontrada')
  }

  const keys = db.prepare(
    "SELECT id, type, value, status, created_at FROM pix_keys WHERE account_id = ? AND status = 'active'"
  ).all(account.id) as PixKeyRow[]

  return keys.map((k) => ({
    id: k.id,
    type: k.type,
    value: k.value,
    status: k.status,
    createdAt: k.created_at,
  }))
}

export function deactivatePixKey(userId: string, keyId: string) {
  const db = getDatabase()

  const account = db.prepare(
    'SELECT id FROM accounts WHERE user_id = ? AND deleted_at IS NULL'
  ).get(userId) as { id: string } | undefined

  if (!account) {
    throw new AppError(ErrorCode.NOT_FOUND, 'Conta não encontrada')
  }

  const key = db.prepare(
    "SELECT id FROM pix_keys WHERE id = ? AND account_id = ? AND status = 'active'"
  ).get(keyId, account.id)

  if (!key) {
    throw new AppError(ErrorCode.PIX_KEY_NOT_FOUND, 'Chave Pix não encontrada')
  }

  db.prepare(
    "UPDATE pix_keys SET status = 'inactive', deleted_at = datetime('now') WHERE id = ?"
  ).run(keyId)

  return { message: 'Chave Pix desativada com sucesso' }
}
