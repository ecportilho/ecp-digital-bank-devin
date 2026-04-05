import { getDatabase } from '../../database/connection.js'
import { AppError } from '../../shared/errors/app-error.js'
import { ErrorCode } from '../../shared/errors/error-codes.js'

interface AccountRow {
  id: string
  user_id: string
  balance: number
  status: string
  created_at: string
  updated_at: string
}

export interface AccountResponse {
  id: string
  userId: string
  balance: number
  status: string
  createdAt: string
}

export function getAccountByUserId(userId: string): AccountResponse {
  const db = getDatabase()
  const account = db.prepare(
    'SELECT id, user_id, balance, status, created_at FROM accounts WHERE user_id = ? AND deleted_at IS NULL'
  ).get(userId) as AccountRow | undefined

  if (!account) {
    throw new AppError(ErrorCode.NOT_FOUND, 'Conta não encontrada')
  }

  return {
    id: account.id,
    userId: account.user_id,
    balance: account.balance,
    status: account.status,
    createdAt: account.created_at,
  }
}

export function getAccountById(accountId: string): AccountRow {
  const db = getDatabase()
  const account = db.prepare(
    'SELECT * FROM accounts WHERE id = ? AND deleted_at IS NULL'
  ).get(accountId) as AccountRow | undefined

  if (!account) {
    throw new AppError(ErrorCode.NOT_FOUND, 'Conta não encontrada')
  }

  return account
}
