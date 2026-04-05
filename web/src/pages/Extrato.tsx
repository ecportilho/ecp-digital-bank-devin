import { useState, useEffect } from 'react'
import { ArrowLeftRight, TrendingUp, TrendingDown, Filter } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/api'
import { formatBRL, formatDate } from '@/lib/format'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface Transaction {
  id: string
  type: string
  amount: number
  description: string | null
  category: string | null
  createdAt: string
}

const typeLabels: Record<string, string> = {
  pix_sent: 'Pix Enviado',
  pix_received: 'Pix Recebido',
  payment: 'Pagamento',
  deposit: 'Depósito',
  card_purchase: 'Compra Cartão',
}

const typeFilters = [
  { value: '', label: 'Todos' },
  { value: 'pix_sent', label: 'Pix Enviado' },
  { value: 'pix_received', label: 'Pix Recebido' },
  { value: 'payment', label: 'Pagamento' },
  { value: 'deposit', label: 'Depósito' },
  { value: 'card_purchase', label: 'Compra Cartão' },
]

export function ExtratoPage() {
  const { token } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    setLoading(true)
    const query = filter ? `?type=${filter}&limit=100` : '?limit=100'
    api<Transaction[]>(`/transactions${query}`, { token })
      .then(setTransactions)
      .finally(() => setLoading(false))
  }, [token, filter])

  const totalIn = transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
  const totalOut = transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <ArrowLeftRight size={28} className="text-info" />
        <h1 className="text-2xl font-bold text-text-primary">Extrato</h1>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="text-xs text-text-tertiary mb-1">Entradas</p>
          <p className="text-lg font-bold text-success">{formatBRL(totalIn)}</p>
        </Card>
        <Card>
          <p className="text-xs text-text-tertiary mb-1">Saídas</p>
          <p className="text-lg font-bold text-danger">{formatBRL(totalOut)}</p>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Filter size={16} className="text-text-tertiary" />
          <span className="text-sm text-text-secondary">Filtrar por tipo:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {typeFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-control text-xs font-medium transition-colors ${
                filter === f.value
                  ? 'bg-lime text-background'
                  : 'bg-secondary text-text-secondary border border-border hover:text-text-primary'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Transactions */}
      <Card>
        {loading ? (
          <p className="text-sm text-text-tertiary text-center py-8">Carregando...</p>
        ) : transactions.length === 0 ? (
          <p className="text-sm text-text-tertiary text-center py-8">Nenhuma transação encontrada</p>
        ) : (
          <div className="space-y-1">
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      txn.amount > 0 ? 'bg-success/10' : 'bg-danger/10'
                    }`}
                  >
                    {txn.amount > 0 ? (
                      <TrendingUp size={16} className="text-success" />
                    ) : (
                      <TrendingDown size={16} className="text-danger" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-text-primary">{txn.description || 'Transação'}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-text-tertiary">{formatDate(txn.createdAt)}</span>
                      <Badge variant="neutral">{typeLabels[txn.type] || txn.type}</Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${
                      txn.amount > 0 ? 'text-success' : 'text-danger'
                    }`}
                  >
                    {txn.amount > 0 ? '+' : ''}
                    {formatBRL(txn.amount)}
                  </p>
                  {txn.category && (
                    <span className="text-xs text-text-tertiary">{txn.category}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
