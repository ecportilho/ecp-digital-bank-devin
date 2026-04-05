import type { FastifyInstance } from 'fastify'
import { registerSchema, loginSchema } from './auth.schemas.js'
import { register, login } from './auth.service.js'

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post('/auth/register', async (request, reply) => {
    const body = registerSchema.parse(request.body)
    const result = await register(body)
    return reply.status(201).send(result)
  })

  app.post('/auth/login', async (request, reply) => {
    const body = loginSchema.parse(request.body)
    const result = await login(body)
    return reply.status(200).send(result)
  })
}
