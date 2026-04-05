import { useState } from 'react'
import { Receipt } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { api, ApiError } from '@/lib/api'
import { formatBRL } from '@/lib/format'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'

interface PaymentResult {
  transactionId: string
  amount: number
  barcode: string
  newBalance: number
}

export function PaymentsPage() {
  const { token } = useAuth()
  const [barcode, setBarcode] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [receipt, setReceipt] = useState<PaymentResult | null>(null)

  const handlePayBoleto = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const amountCents = Math.round(parseFloat(amount) * 100)
      if (isNaN(amountCents) || amountCents <= 0) {
        setError('Informe um valor válido')
        setLoading(false)
        return
      }
      const result = await api<PaymentResult>('/payments/boleto', {
        method: 'POST',
        token: token!,
        body: { barcode, amount: amountCents, description: description || undefined },
      })
      setReceipt(result)
      setBarcode('')
      setAmount('')
      setDescription('')
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Erro ao pagar boleto')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Receipt size={28} className="text-success" />
        <h1 className="text-2xl font-bold text-text-primary">Pagamentos</h1>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/20 rounded-control p-3">
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      <Card>
        <h2 className="text-base font-semibold text-text-primary mb-4">Pagar Boleto</h2>
        <form onSubmit={handlePayBoleto} className="space-y-4">
          <Input
            label="Código de barras"
            placeholder="Digite ou cole o código de barras"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            required
          />
          <Input
            label="Valor (R$)"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <Input
            label="Descrição (opcional)"
            placeholder="Ex: Conta de luz"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button type="submit" className="w-full" isLoading={loading}>
            Pagar boleto
          </Button>
        </form>
      </Card>

      <Modal isOpen={!!receipt} onClose={() => setReceipt(null)} title="Comprovante de Pagamento">
        {receipt && (
          <div className="space-y-4">
            <div className="bg-success/10 border border-success/20 rounded-control p-4 text-center">
              <p className="text-sm text-success font-medium">Pagamento realizado!</p>
              <p className="text-2xl font-bold text-text-primary mt-2">{formatBRL(receipt.amount)}</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-text-tertiary">Código de barras</span>
                <span className="text-text-primary font-mono text-xs truncate max-w-[200px]">{receipt.barcode}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-text-tertiary">Novo saldo</span>
                <span className="text-text-primary font-semibold">{formatBRL(receipt.newBalance)}</span>
              </div>
            </div>
            <Button variant="secondary" className="w-full" onClick={() => setReceipt(null)}>
              Fechar
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
