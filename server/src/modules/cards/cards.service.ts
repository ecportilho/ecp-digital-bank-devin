import bcrypt from 'bcryptjs'
import { getDatabase } from '../../database/connection.js'
import { AppError } from '../../shared/errors/app-error.js'
import { ErrorCode } from '../../shared/errors/error-codes.js'
import { generateId } from '../../shared/utils/uuid.js'
import type { CreateCardInput, UpdateCardStatusInput } from './cards.schemas.js'

interface CardRow {
  id: string
  account_id: string
  last_four: string
  holder_name: string
  expiry_month: number
  expiry_year: number
  credit_limit: number
  status: string
  created_at: string
}

function generateCardNumber(): { lastFour: string } {
  const lastFour = Math.floor(1000 + Math.random() * 9000).toString()
  return { lastFour }
}

function generateCvv(): string {
  return Math.floor(100 + Math.random() * 900).toString()
}

export async function createCard(userId: string, input: CreateCardInput) {
  const db = getDatabase()

  const account = db.prepare(
    'SELECT id FROM accounts WHERE user_id = ? AND deleted_at IS NULL'
  ).get(userId) as { id: string } | undefined

  if (!account) {
    throw new AppError(ErrorCode.NOT_FOUND, 'Conta não encontrada')
  }

  const cardId = generateId()
  const { lastFour } = generateCardNumber()
  const cvv = generateCvv()
  const cvvHash = await bcrypt.hash(cvv, 10)

  const now = new Date()
  const expiryMonth = now.getMonth() + 1
  const expiryYear = now.getFullYear() + 3

  db.prepare(`
    INSERT INTO cards (id, account_id, last_four, holder_name, expiry_month, expiry_year, cvv_hash, credit_limit, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 500000, 'active')
  `).run(cardId, account.id, lastFour, input.holderName.toUpperCase(), expiryMonth, expiryYear, cvvHash)

  return {
    id: cardId,
    lastFour,
    holderName: input.holderName.toUpperCase(),
    expiryMonth,
    expiryYear,
    creditLimit: 500000,
    status: 'active',
    createdAt: new Date().toISOString(),
  }
}

export function listCards(userId: string) {
  const db = getDatabase()

  const account = db.prepare(
    'SELECT id FROM accounts WHERE user_id = ? AND deleted_at IS NULL'
  ).get(userId) as { id: string } | undefined

  if (!account) {
    throw new AppError(ErrorCode.NOT_FOUND, 'Conta não encontrada')
  }

  const cards = db.prepare(
    "SELECT id, last_four, holder_name, expiry_month, expiry_year, credit_limit, status, created_at FROM cards WHERE account_id = ? AND deleted_at IS NULL"
  ).all(account.id) as CardRow[]

  return cards.map((c) => ({
    id: c.id,
    lastFour: c.last_four,
    holderName: c.holder_name,
    expiryMonth: c.expiry_month,
    expiryYear: c.expiry_year,
    creditLimit: c.credit_limit,
    status: c.status,
    createdAt: c.created_at,
  }))
}

export function updateCardStatus(userId: string, cardId: string, input: UpdateCardStatusInput) {
  const db = getDatabase()

  const account = db.prepare(
    'SELECT id FROM accounts WHERE user_id = ? AND deleted_at IS NULL'
  ).get(userId) as { id: string } | undefined

  if (!account) {
    throw new AppError(ErrorCode.NOT_FOUND, 'Conta não encontrada')
  }

  const card = db.prepare(
    'SELECT id, status FROM cards WHERE id = ? AND account_id = ? AND deleted_at IS NULL'
  ).get(cardId, account.id) as { id: string; status: string } | undefined

  if (!card) {
    throw new AppError(ErrorCode.CARD_NOT_FOUND, 'Cartão não encontrado')
  }

  if (input.status === 'blocked' && card.status === 'blocked') {
    throw new AppError(ErrorCode.CARD_ALREADY_BLOCKED, 'Cartão já está bloqueado')
  }

  if (input.status === 'active' && card.status === 'active') {
    throw new AppError(ErrorCode.CARD_ALREADY_ACTIVE, 'Cartão já está ativo')
  }

  db.prepare(
    "UPDATE cards SET status = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(input.status, cardId)

  return { id: cardId, status: input.status, message: input.status === 'blocked' ? 'Cartão bloqueado' : 'Cartão desbloqueado' }
}
