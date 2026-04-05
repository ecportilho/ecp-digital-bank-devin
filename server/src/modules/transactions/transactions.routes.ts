import type { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../shared/middleware/auth.js'
import { getDatabase } from '../../database/connection.js'
import { AppError } from '../../shared/errors/app-error.js'
import { ErrorCode } from '../../shared/errors/error-codes.js'

interface TransactionRow {
  id: string
  account_id: string
  type: string
  amount: number
  description: string | null
  category: string | null
  created_at: string
}

export async function transactionsRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('onRequest', authMiddleware)

  app.get('/transactions', async (request) => {
    const db = getDatabase()
    const { type, limit, offset } = request.query as {
      type?: string
      limit?: string
      offset?: string
    }

    const account = db.prepare(
      'SELECT id FROM accounts WHERE user_id = ? AND deleted_at IS NULL'
    ).get(request.user.id) as { id: string } | undefined

    if (!account) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Conta não encontrada')
    }

    let query = 'SELECT id, account_id, type, amount, description, category, created_at FROM transactions WHERE account_id = ?'
    const params: (string | number)[] = [account.id]

    if (type) {
      query += ' AND type = ?'
      params.push(type)
    }

    query += ' ORDER BY created_at DESC'

    const queryLimit = Math.min(parseInt(limit || '50', 10), 100)
    const queryOffset = parseInt(offset || '0', 10)
    query += ' LIMIT ? OFFSET ?'
    params.push(queryLimit, queryOffset)

    const transactions = db.prepare(query).all(...params) as TransactionRow[]

    return transactions.map((t) => ({
      id: t.id,
      type: t.type,
      amount: t.amount,
      description: t.description,
      category: t.category,
      createdAt: t.created_at,
    }))
  })
}
