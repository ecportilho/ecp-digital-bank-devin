import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { authMiddleware } from '../../shared/middleware/auth.js'
import { getDatabase } from '../../database/connection.js'
import { AppError } from '../../shared/errors/app-error.js'
import { ErrorCode } from '../../shared/errors/error-codes.js'

interface UserRow {
  id: string
  name: string
  cpf: string
  email: string
  created_at: string
}

interface NotificationRow {
  id: string
  title: string
  body: string
  type: string
  read: number
  created_at: string
}

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
})

export async function usersRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('onRequest', authMiddleware)

  app.get('/users/me', async (request) => {
    const db = getDatabase()
    const user = db.prepare(
      'SELECT id, name, cpf, email, created_at FROM users WHERE id = ? AND deleted_at IS NULL'
    ).get(request.user.id) as UserRow | undefined

    if (!user) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Usuário não encontrado')
    }

    return {
      id: user.id,
      name: user.name,
      cpf: user.cpf,
      email: user.email,
      createdAt: user.created_at,
    }
  })

  app.patch('/users/me', async (request) => {
    const db = getDatabase()
    const body = updateProfileSchema.parse(request.body)

    if (body.name) {
      db.prepare(
        "UPDATE users SET name = ?, updated_at = datetime('now') WHERE id = ?"
      ).run(body.name, request.user.id)
    }

    const user = db.prepare(
      'SELECT id, name, cpf, email, created_at FROM users WHERE id = ? AND deleted_at IS NULL'
    ).get(request.user.id) as UserRow

    return {
      id: user.id,
      name: user.name,
      cpf: user.cpf,
      email: user.email,
      createdAt: user.created_at,
    }
  })

  // Soft delete (RN-07)
  app.delete('/users/me', async (request, reply) => {
    const db = getDatabase()
    db.prepare(
      "UPDATE users SET deleted_at = datetime('now'), updated_at = datetime('now') WHERE id = ?"
    ).run(request.user.id)

    db.prepare(
      "UPDATE accounts SET deleted_at = datetime('now'), status = 'closed', updated_at = datetime('now') WHERE user_id = ?"
    ).run(request.user.id)

    return reply.status(204).send()
  })

  // Notifications
  app.get('/users/me/notifications', async (request) => {
    const db = getDatabase()
    const notifications = db.prepare(
      'SELECT id, title, body, type, read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50'
    ).all(request.user.id) as NotificationRow[]

    return notifications.map((n) => ({
      id: n.id,
      title: n.title,
      body: n.body,
      type: n.type,
      read: n.read === 1,
      createdAt: n.created_at,
    }))
  })

  app.patch('/users/me/notifications/:notificationId/read', async (request) => {
    const db = getDatabase()
    const { notificationId } = request.params as { notificationId: string }
    db.prepare('UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?')
      .run(notificationId, request.user.id)
    return { message: 'Notificação marcada como lida' }
  })
}
