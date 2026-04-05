import type { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../shared/middleware/auth.js'
import { sendPixSchema, createPixKeySchema } from './pix.schemas.js'
import { sendPix, createPixKey, listPixKeys, deactivatePixKey } from './pix.service.js'

export async function pixRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('onRequest', authMiddleware)

  app.post('/pix/send', async (request, reply) => {
    const body = sendPixSchema.parse(request.body)
    const result = sendPix(request.user.id, body)
    return reply.status(201).send(result)
  })

  app.post('/pix/keys', async (request, reply) => {
    const body = createPixKeySchema.parse(request.body)
    const result = createPixKey(request.user.id, body)
    return reply.status(201).send(result)
  })

  app.get('/pix/keys', async (request) => {
    return listPixKeys(request.user.id)
  })

  app.delete('/pix/keys/:keyId', async (request) => {
    const { keyId } = request.params as { keyId: string }
    return deactivatePixKey(request.user.id, keyId)
  })
}
