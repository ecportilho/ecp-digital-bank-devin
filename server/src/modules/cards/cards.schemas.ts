import { z } from 'zod'

export const createCardSchema = z.object({
  holderName: z.string().min(2, 'Nome do titular é obrigatório'),
})

export const updateCardStatusSchema = z.object({
  status: z.enum(['active', 'blocked']),
})

export type CreateCardInput = z.infer<typeof createCardSchema>
export type UpdateCardStatusInput = z.infer<typeof updateCardStatusSchema>
