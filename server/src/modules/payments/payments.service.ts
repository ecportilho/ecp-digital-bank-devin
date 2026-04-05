import { getDatabase } from '../../database/connection.js'
import { AppError } from '../../shared/errors/app-error.js'
import { ErrorCode } from '../../shared/errors/error-codes.js'
import { generateId } from '../../shared/utils/uuid.js'
import type { PayBoletoInput } from './payments.schemas.js'

export function payBoleto(userId: string, input: PayBoletoInput) {
  const db = getDatabase()

  // Check idempotency
  if (input.idempotencyKey) {
    const existing = db.prepare(
      'SELECT id FROM transactions WHERE idempotency_key = ?'
    ).get(input.idempotencyKey)
    if (existing) {
      throw new AppError(ErrorCode.DUPLICATE_REQUEST, 'Pagamento já processado')
    }
  }

  const account = db.prepare(
    'SELECT id, balance FROM accounts WHERE user_id = ? AND deleted_at IS NULL'
  ).get(userId) as { id: string; balance: number } | undefined

  if (!account) {
    throw new AppError(ErrorCode.NOT_FOUND, 'Conta não encontrada')
  }

  if (account.balance < input.amount) {
    throw new AppError(ErrorCode.INSUFFICIENT_BALANCE, 'Saldo insuficiente')
  }

  const transactionId = generateId()

  const runTransaction = db.transaction(() => {
    db.prepare("UPDATE accounts SET balance = balance - ?, updated_at = datetime('now') WHERE id = ?")
      .run(input.amount, account.id)

    db.prepare(`
      INSERT INTO transactions (id, account_id, type, amount, description, category, idempotency_key)
      VALUES (?, ?, 'payment', ?, ?, 'bills', ?)
    `).run(transactionId, account.id, -input.amount, input.description || 'Pagamento de boleto', input.idempotencyKey || null)
  })

  runTransaction()

  const updatedAccount = db.prepare('SELECT balance FROM accounts WHERE id = ?').get(account.id) as { balance: number }

  return {
    transactionId,
    amount: input.amount,
    barcode: input.barcode,
    description: input.description || 'Pagamento de boleto',
    newBalance: updatedAccount.balance,
    createdAt: new Date().toISOString(),
  }
}
