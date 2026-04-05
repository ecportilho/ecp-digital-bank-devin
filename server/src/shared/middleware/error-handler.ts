import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'
import { AppError } from '../errors/app-error.js'
import { ErrorCode } from '../errors/error-codes.js'

export function errorHandler(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply
): void {
  if (error instanceof AppError) {
    reply.status(error.statusCode).send({
      status: 'error',
      code: error.code,
      message: error.message,
    })
    return
  }

  if (error instanceof ZodError) {
    reply.status(400).send({
      status: 'error',
      code: ErrorCode.VALIDATION_ERROR,
      message: 'Dados inválidos',
      details: error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    })
    return
  }

  console.error('Unhandled error:', error)
  reply.status(500).send({
    status: 'error',
    code: ErrorCode.INTERNAL_ERROR,
    message: 'Erro interno do servidor',
  })
}
