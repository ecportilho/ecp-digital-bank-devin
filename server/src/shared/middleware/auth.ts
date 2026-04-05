import type { FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'
import { AppError } from '../errors/app-error.js'
import { ErrorCode } from '../errors/error-codes.js'

const JWT_SECRET = process.env.JWT_SECRET || 'ecp-digital-bank-dev-secret-key-2026'

interface JwtPayload {
  userId: string
  email: string
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

export function verifyToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch {
    throw new AppError(ErrorCode.TOKEN_EXPIRED, 'Token inválido ou expirado')
  }
}

export async function authMiddleware(
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> {
  const authHeader = request.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError(ErrorCode.UNAUTHORIZED, 'Token de autenticação não fornecido')
  }

  const token = authHeader.substring(7)
  const payload = verifyToken(token)

  request.user = {
    id: payload.userId,
    email: payload.email,
  }
}
