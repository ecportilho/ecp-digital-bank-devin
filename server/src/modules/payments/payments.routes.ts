import type { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../shared/middleware/auth.js'
import { payBoletoSchema } from './payments.schemas.js'
import { payBoleto } from './payments.service.js'

export async function paymentsRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('onRequest', authMiddleware)

  app.post('/payments/boleto', async (request, reply) => {
    const body = payBoletoSchema.parse(request.body)
    const result = payBoleto(request.user.id, body)
    return reply.status(201).send(result)
  })
}
