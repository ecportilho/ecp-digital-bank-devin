import { useState, useEffect } from 'react'
import { CreditCard, Plus, Lock, Unlock } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { api, ApiError } from '@/lib/api'
import { formatBRL } from '@/lib/format'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'

interface VirtualCard {
  id: string
  lastFour: string
  holderName: string
  expiryMonth: number
  expiryYear: number
  creditLimit: number
  status: string
}

export function CardsPage() {
  const { token } = useAuth()
  const [cards, setCards] = useState<VirtualCard[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [holderName, setHolderName] = useState('')
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const loadCards = () => {
    if (!token) return
    api<VirtualCard[]>('/cards', { token })
      .then(setCards)
      .finally(() => setLoading(false))
  }

  useEffect(loadCards, [token])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setActionLoading('create')
    try {
      await api('/cards', {
        method: 'POST',
        token: token!,
        body: { holderName },
      })
      loadCards()
      setShowCreate(false)
      setHolderName('')
    } catch (err) {
      if (err instanceof ApiError) setError(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const handleToggleStatus = async (card: VirtualCard) => {
    const newStatus = card.status === 'active' ? 'blocked' : 'active'
    setActionLoading(card.id)
    try {
      await api(`/cards/${card.id}/status`, {
        method: 'PATCH',
        token: token!,
        body: { status: newStatus },
      })
      loadCards()
    } catch (err) {
      if (err instanceof ApiError) setError(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CreditCard size={28} className="text-warning" />
          <h1 className="text-2xl font-bold text-text-primary">Cartões</h1>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus size={16} className="mr-1" />
          Novo cartão
        </Button>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/20 rounded-control p-3">
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-text-tertiary text-center py-8">Carregando...</p>
      ) : cards.length === 0 ? (
        <Card>
          <p className="text-sm text-text-tertiary text-center py-8">
            Nenhum cartão virtual. Crie seu primeiro cartão!
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`relative overflow-hidden rounded-card p-6 ${
                card.status === 'active'
                  ? 'bg-gradient-to-br from-surface to-secondary border border-lime/20'
                  : 'bg-surface border border-border opacity-75'
              }`}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-xs text-text-tertiary">Cartão Virtual</p>
                  <Badge variant={card.status === 'active' ? 'success' : 'danger'}>
                    {card.status === 'active' ? 'Ativo' : 'Bloqueado'}
                  </Badge>
                </div>
                <CreditCard size={32} className="text-lime/30" />
              </div>

              <p className="text-xl font-mono text-text-primary tracking-widest mb-4">
                •••• •••• •••• {card.lastFour}
              </p>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-text-tertiary">Titular</p>
                  <p className="text-sm text-text-primary font-medium">{card.holderName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-text-tertiary">Validade</p>
                  <p className="text-sm text-text-primary">
                    {String(card.expiryMonth).padStart(2, '0')}/{card.expiryYear}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-text-tertiary">Limite</p>
                  <p className="text-sm text-text-primary">{formatBRL(card.creditLimit)}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <Button
                  variant={card.status === 'active' ? 'danger' : 'secondary'}
                  size="sm"
                  onClick={() => handleToggleStatus(card)}
                  isLoading={actionLoading === card.id}
                >
                  {card.status === 'active' ? (
                    <><Lock size={14} className="mr-1" /> Bloquear</>
                  ) : (
                    <><Unlock size={14} className="mr-1" /> Desbloquear</>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Novo Cartão Virtual">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Nome do titular"
            placeholder="NOME COMO NO CARTÃO"
            value={holderName}
            onChange={(e) => setHolderName(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" isLoading={actionLoading === 'create'}>
            Criar cartão
          </Button>
        </form>
      </Modal>
    </div>
  )
}
