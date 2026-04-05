import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
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

  // Routes
  await app.register(authRoutes)
  await app.register(accountsRoutes)
  await app.register(pixRoutes)
  await app.register(transactionsRoutes)
  await app.register(cardsRoutes)
  await app.register(paymentsRoutes)
  await app.register(usersRoutes)

  // Start
  await app.listen({ port: PORT, host: '0.0.0.0' })
  console.log(`🏦 ECP Digital Bank server running on http://localhost:${PORT}`)
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
