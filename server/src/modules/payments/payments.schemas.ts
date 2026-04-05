import { z } from 'zod'

export const payBoletoSchema = z.object({
  barcode: z.string().min(10, 'Código de barras inválido'),
  amount: z.number().int().positive('Valor deve ser maior que zero'),
  description: z.string().optional(),
  idempotencyKey: z.string().optional(),
})

export type PayBoletoInput = z.infer<typeof payBoletoSchema>
