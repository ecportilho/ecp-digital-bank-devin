import { ErrorCode, ERROR_STATUS_MAP } from './error-codes.js'

export class AppError extends Error {
  public readonly code: ErrorCode
  public readonly statusCode: number

  constructor(code: ErrorCode, message: string) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.statusCode = ERROR_STATUS_MAP[code] || 500
  }
}
