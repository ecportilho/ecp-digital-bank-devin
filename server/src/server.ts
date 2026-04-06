import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import fastifyStatic from '@fastify/static'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getDatabase } from './database/connection.js'
import { up } from './database/migrations/001_initial.js'
import { errorHandler } from './shared/middleware/error-handler.js'
import { authRoutes } from './modules/auth/auth.routes.js'
import { accountsRoutes } from './modules/accounts/accounts.routes.js'
import { pixRoutes } from './modules/pix/pix.routes.js'
import { transactionsRoutes } from './modules/transactions/transactions.routes.js'
import { cardsRoutes } from './modules/cards/cards.routes.js'
import { paymentsRoutes } from './modules/payments/payments.routes.js'
import { usersRoutes } from './modules/users/users.routes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = parseInt(process.env.PORT || '3333', 10)

async function bootstrap(): Promise<void> {
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    },
  })

  // Run migrations on startup
  const db = getDatabase()
  up(db)

  // Plugins
  await app.register(cors, {
    origin: true,
    credentials: true,
  })

  await app.register(helmet, {
    contentSecurityPolicy: false,
  })

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  })

  // Error handler
  app.setErrorHandler(errorHandler)

  // Health check
  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })

  // API Routes (under /api prefix for production static serving)
  await app.register(async function apiRoutes(api) {
    await api.register(authRoutes)
    await api.register(accountsRoutes)
    await api.register(pixRoutes)
    await api.register(transactionsRoutes)
    await api.register(cardsRoutes)
    await api.register(paymentsRoutes)
    await api.register(usersRoutes)
  }, { prefix: '/api' })

  // Serve frontend static files in production
  const webDistPath = path.join(__dirname, '..', '..', 'web', 'dist')
  await app.register(fastifyStatic, {
    root: webDistPath,
    prefix: '/',
    wildcard: false,
  })

  // SPA fallback: serve index.html for non-API routes
  app.setNotFoundHandler(async (request, reply) => {
    if (request.url.startsWith('/api/') || request.url.startsWith('/auth/') || request.url.startsWith('/accounts/') || request.url.startsWith('/pix/') || request.url.startsWith('/transactions/') || request.url.startsWith('/cards/') || request.url.startsWith('/payments/') || request.url.startsWith('/users/') || request.url.startsWith('/health')) {
      return reply.status(404).send({ code: 'NOT_FOUND', message: 'Rota não encontrada' })
    }
    return reply.sendFile('index.html')
  })

  // Start
  await app.listen({ port: PORT, host: '0.0.0.0' })
  console.log(`🏦 ECP Digital Bank server running on http://localhost:${PORT}`)
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
