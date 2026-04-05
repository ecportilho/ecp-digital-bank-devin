import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { getDatabase, closeDatabase } from './connection.js'
import { up } from './migrations/001_initial.js'
import { generateId } from '../shared/utils/uuid.js'

async function seed(): Promise<void> {
  const db = getDatabase()
  console.log('Seeding database...')

  try {
    // Run migrations first
    up(db)

    // Check if data already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get('joao@email.com')
    if (existingUser) {
      console.log('Seed data already exists. Skipping.')
      return
    }

    const userId = generateId()
    const accountId = generateId()
    const passwordHash = await bcrypt.hash('Senha@123', 10)

    // Create demo user
    db.prepare(`
      INSERT INTO users (id, name, cpf, email, password_hash)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, 'João Silva', '12345678900', 'joao@email.com', passwordHash)

    // Create account with R$ 5.000,00 balance (500000 centavos)
    db.prepare(`
      INSERT INTO accounts (id, user_id, balance, status)
      VALUES (?, ?, ?, 'active')
    `).run(accountId, userId, 500000)

    // Create a Pix key
    const pixKeyId = generateId()
    db.prepare(`
      INSERT INTO pix_keys (id, account_id, type, value, status)
      VALUES (?, ?, 'email', 'joao@email.com', 'active')
    `).run(pixKeyId, accountId)

    // Create a virtual card
    const cardId = generateId()
    const cvvHash = await bcrypt.hash('123', 10)
    db.prepare(`
      INSERT INTO cards (id, account_id, last_four, holder_name, expiry_month, expiry_year, cvv_hash, credit_limit, status)
      VALUES (?, ?, '4321', 'JOAO SILVA', 12, 2028, ?, 500000, 'active')
    `).run(cardId, accountId, cvvHash)

    // Create some transactions
    const txns = [
      { type: 'deposit', amount: 500000, description: 'Depósito inicial', category: 'income' },
      { type: 'pix_sent', amount: -15000, description: 'Pix para Maria', category: 'transfer' },
      { type: 'pix_received', amount: 8500, description: 'Pix de Pedro', category: 'transfer' },
      { type: 'payment', amount: -12000, description: 'Conta de luz', category: 'utilities' },
      { type: 'card_purchase', amount: -4500, description: 'Mercado Livre', category: 'shopping' },
      { type: 'pix_sent', amount: -25000, description: 'Aluguel', category: 'housing' },
      { type: 'pix_received', amount: 350000, description: 'Salário', category: 'income' },
    ]

    for (const txn of txns) {
      db.prepare(`
        INSERT INTO transactions (id, account_id, type, amount, description, category)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(generateId(), accountId, txn.type, txn.amount, txn.description, txn.category)
    }

    // Create a notification
    db.prepare(`
      INSERT INTO notifications (id, user_id, title, body, type)
      VALUES (?, ?, 'Pix recebido', 'Você recebeu R$ 85,00 de Pedro', 'pix_received')
    `).run(generateId(), userId)

    console.log('Seed completed successfully.')
    console.log(`  User: joao@email.com / Senha@123`)
    console.log(`  Balance: R$ 5.000,00`)
  } catch (error) {
    console.error('Seed failed:', error)
    process.exit(1)
  } finally {
    closeDatabase()
  }
}

seed()
