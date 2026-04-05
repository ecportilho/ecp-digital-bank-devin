import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Zap,
  ArrowLeftRight,
  CreditCard,
  Receipt,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/api'
import { formatBRL, formatDate } from '@/lib/format'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface Account {
  id: string
  balance: number
  status: string
}

interface Transaction {
  id: string
  type: string
  amount: number
  description: string
  category: string
  createdAt: string
}

const quickActions = [
  { to: '/pix', icon: Zap, label: 'Pix', color: 'text-lime' },
  { to: '/extrato', icon: ArrowLeftRight, label: 'Extrato', color: 'text-info' },
  { to: '/cartoes', icon: CreditCard, label: 'Cartões', color: 'text-warning' },
  { to: '/pagamentos', icon: Receipt, label: 'Pagar', color: 'text-success' },
]

export function DashboardPage() {
  const { token, user } = useAuth()
  const [account, setAccount] = useState<Account | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showBalance, setShowBalance] = useState(true)

  useEffect(() => {
    if (!token) return
    api<Account>('/accounts/me', { token }).then(setAccount)
    api<Transaction[]>('/transactions?limit=5', { token }).then(setTransactions)
  }, [token])

  const firstName = user?.name?.split(' ')[0] || ''

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Olá, {firstName}
        </h1>
        <p className="text-text-tertiary text-sm mt-1">
          Bem-vindo ao seu banco digital
        </p>
      </div>

      {/* Balance Card */}
      <Card variant="highlight">
        <div className="flex items-center justify-between mb-1">
          <span className="text-text-secondary text-sm">Saldo disponível</span>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="text-text-tertiary hover:text-text-primary transition-colors"
          >
            {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <p className="text-3xl font-bold text-text-primary">
          {showBalance && account ? formatBRL(account.balance) : '•••••'}
        </p>
        <p className="text-xs text-text-tertiary mt-2">
          Conta {account?.status === 'active' ? 'ativa' : account?.status}
        </p>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="flex flex-col items-center gap-2 p-4 bg-surface border border-border rounded-card hover:border-lime/20 transition-all"
          >
            <action.icon size={24} className={action.color} />
            <span className="text-xs text-text-secondary font-medium">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Recent Transactions */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-text-primary">Últimas transações</h2>
          <Link to="/extrato" className="text-xs text-lime hover:text-lime-pressed">
            Ver todas
          </Link>
        </div>

        {transactions.length === 0 ? (
          <p className="text-sm text-text-tertiary text-center py-6">
            Nenhuma transação encontrada
          </p>
        ) : (
          <div className="space-y-3">
            {transactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${txn.amount > 0 ? 'bg-success/10' : 'bg-danger/10'}`}>
                    {txn.amount > 0 ? (
                      <TrendingUp size={16} className="text-success" />
                    ) : (
                      <TrendingDown size={16} className="text-danger" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-text-primary">{txn.description}</p>
                    <p className="text-xs text-text-tertiary">{formatDate(txn.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${txn.amount > 0 ? 'text-success' : 'text-danger'}`}>
                    {txn.amount > 0 ? '+' : ''}{formatBRL(txn.amount)}
                  </p>
                  {txn.category && (
                    <Badge variant="neutral">{txn.category}</Badge>
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
