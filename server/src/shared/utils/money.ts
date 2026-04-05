/**
 * Converte reais (float) para centavos (integer).
 * RN-09: Valores monetários sempre integer em centavos.
 */
export function reaisToCentavos(reais: number): number {
  return Math.round(reais * 100)
}

/**
 * Converte centavos (integer) para reais (float) para exibição.
 */
export function centavosToReais(centavos: number): number {
  return centavos / 100
}

/**
 * Formata centavos como string em formato BRL.
 */
export function formatBRL(centavos: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(centavos / 100)
}
