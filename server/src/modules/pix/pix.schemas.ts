import { z } from 'zod'

export const sendPixSchema = z.object({
  keyType: z.enum(['cpf', 'email', 'phone', 'random']),
  keyValue: z.string().min(1, 'Chave Pix é obrigatória'),
  amount: z.number().int().positive('Valor deve ser maior que zero'),
  description: z.string().optional(),
  idempotencyKey: z.string().optional(),
})

export const createPixKeySchema = z.object({
  type: z.enum(['cpf', 'email', 'phone', 'random']),
  value: z.string().min(1, 'Valor da chave é obrigatório'),
})

export type SendPixInput = z.infer<typeof sendPixSchema>
export type CreatePixKeyInput = z.infer<typeof createPixKeySchema>
