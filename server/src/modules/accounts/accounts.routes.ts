import type { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../shared/middleware/auth.js'
import { getAccountByUserId } from './accounts.service.js'

export async function accountsRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('onRequest', authMiddleware)

  app.get('/accounts/me', async (request) => {
    return getAccountByUserId(request.user.id)
  })
}
