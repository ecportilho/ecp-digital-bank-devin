import type { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../shared/middleware/auth.js'
import { createCardSchema, updateCardStatusSchema } from './cards.schemas.js'
import { createCard, listCards, updateCardStatus } from './cards.service.js'

export async function cardsRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('onRequest', authMiddleware)

  app.post('/cards', async (request, reply) => {
    const body = createCardSchema.parse(request.body)
    const result = await createCard(request.user.id, body)
    return reply.status(201).send(result)
  })

  app.get('/cards', async (request) => {
    return listCards(request.user.id)
  })

  app.patch('/cards/:cardId/status', async (request) => {
    const { cardId } = request.params as { cardId: string }
    const body = updateCardStatusSchema.parse(request.body)
    return updateCardStatus(request.user.id, cardId, body)
  })
}
