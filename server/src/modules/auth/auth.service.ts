import bcrypt from 'bcryptjs'
import { getDatabase } from '../../database/connection.js'
import { AppError } from '../../shared/errors/app-error.js'
import { ErrorCode } from '../../shared/errors/error-codes.js'
import { generateId } from '../../shared/utils/uuid.js'
import { generateToken } from '../../shared/middleware/auth.js'
import type { RegisterInput, LoginInput } from './auth.schemas.js'

interface UserRow {
  id: string
  name: string
  cpf: string
  email: string
  password_hash: string
}

interface RegisterResult {
  token: string
  user: { id: string; name: string; email: string; cpf: string }
  account: { id: string; balance: number }
}

interface LoginResult {
  token: string
  user: { id: string; name: string; email: string; cpf: string }
}

export async function register(input: RegisterInput): Promise<RegisterResult> {
  const db = getDatabase()

  const existingEmail = db.prepare('SELECT id FROM users WHERE email = ? AND deleted_at IS NULL').get(input.email)
  if (existingEmail) {
    throw new AppError(ErrorCode.EMAIL_ALREADY_EXISTS, 'E-mail já cadastrado')
  }

  const existingCpf = db.prepare('SELECT id FROM users WHERE cpf = ? AND deleted_at IS NULL').get(input.cpf)
  if (existingCpf) {
    throw new AppError(ErrorCode.CPF_ALREADY_EXISTS, 'CPF já cadastrado')
  }

  const userId = generateId()
  const accountId = generateId()
  const passwordHash = await bcrypt.hash(input.password, 10)

  const insertUser = db.prepare(`
    INSERT INTO users (id, name, cpf, email, password_hash)
    VALUES (?, ?, ?, ?, ?)
  `)

  const insertAccount = db.prepare(`
    INSERT INTO accounts (id, user_id, balance, status)
    VALUES (?, ?, 0, 'active')
  `)

  const runTransaction = db.transaction(() => {
    insertUser.run(userId, input.name, input.cpf, input.email, passwordHash)
    insertAccount.run(accountId, userId)
  })

  runTransaction()

  const token = generateToken({ userId, email: input.email })

  return {
    token,
    user: { id: userId, name: input.name, email: input.email, cpf: input.cpf },
    account: { id: accountId, balance: 0 },
  }
}

export async function login(input: LoginInput): Promise<LoginResult> {
  const db = getDatabase()

  const user = db.prepare(
    'SELECT id, name, cpf, email, password_hash FROM users WHERE email = ? AND deleted_at IS NULL'
  ).get(input.email) as UserRow | undefined

  if (!user) {
    throw new AppError(ErrorCode.INVALID_CREDENTIALS, 'E-mail ou senha incorretos')
  }

  const isValidPassword = await bcrypt.compare(input.password, user.password_hash)
  if (!isValidPassword) {
    throw new AppError(ErrorCode.INVALID_CREDENTIALS, 'E-mail ou senha incorretos')
  }

  const token = generateToken({ userId: user.id, email: user.email })

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, cpf: user.cpf },
  }
}
