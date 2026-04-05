import { useState, useEffect } from 'react'
import { Zap, Plus, Trash2, Send } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { api, ApiError } from '@/lib/api'
import { formatBRL } from '@/lib/format'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'

interface PixKey {
  id: string
  type: string
  value: string
  status: string
  createdAt: string
}

interface SendPixResult {
  transactionId: string
  amount: number
  newBalance: number
}

type PixTab = 'send' | 'keys'

const keyTypeLabels: Record<string, string> = {
  cpf: 'CPF',
  email: 'E-mail',
  phone: 'Telefone',
  random: 'Aleatória',
}

export function PixPage() {
  const { token } = useAuth()
  const [tab, setTab] = useState<PixTab>('send')
  const [keys, setKeys] = useState<PixKey[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Send Pix state
  const [keyType, setKeyType] = useState('cpf')
  const [keyValue, setKeyValue] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')

  // New key modal
  const [showNewKey, setShowNewKey] = useState(false)
  const [newKeyType, setNewKeyType] = useState('email')
  const [newKeyValue, setNewKeyValue] = useState('')

  // Receipt modal
  const [receipt, setReceipt] = useState<SendPixResult | null>(null)

  useEffect(() => {
    if (token) {
      api<PixKey[]>('/pix/keys', { token }).then(setKeys)
    }
  }, [token])

  const handleSendPix = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const amountCents = Math.round(parseFloat(amount) * 100)
      if (isNaN(amountCents) || amountCents <= 0) {
        setError('Informe um valor válido')
        return
      }
      const result = await api<SendPixResult>('/pix/send', {
        method: 'POST',
        token: token!,
        body: { keyType, keyValue, amount: amountCents, description: description || undefined },
      })
      setReceipt(result)
      setKeyValue('')
      setAmount('')
      setDescription('')
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Erro ao enviar Pix')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api('/pix/keys', {
        method: 'POST',
        token: token!,
        body: { type: newKeyType, value: newKeyValue },
      })
      const updatedKeys = await api<PixKey[]>('/pix/keys', { token: token! })
      setKeys(updatedKeys)
      setShowNewKey(false)
      setNewKeyValue('')
      setSuccess('Chave Pix criada com sucesso')
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Erro ao criar chave Pix')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteKey = async (keyId: string) => {
    try {
      await api(`/pix/keys/${keyId}`, { method: 'DELETE', token: token! })
      setKeys(keys.filter((k) => k.id !== keyId))
      setSuccess('Chave Pix desativada')
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      }
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Zap size={28} className="text-lime" />
        <h1 className="text-2xl font-bold text-text-primary">Pix</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => { setTab('send'); setError(''); setSuccess('') }}
          className={`px-4 py-2 rounded-control text-sm font-medium transition-colors ${
            tab === 'send' ? 'bg-lime text-background' : 'bg-surface text-text-secondary border border-border'
          }`}
        >
          <Send size={16} className="inline mr-2" />
          Enviar Pix
        </button>
        <button
          onClick={() => { setTab('keys'); setError(''); setSuccess('') }}
          className={`px-4 py-2 rounded-control text-sm font-medium transition-colors ${
            tab === 'keys' ? 'bg-lime text-background' : 'bg-surface text-text-secondary border border-border'
          }`}
        >
          Minhas Chaves ({keys.length}/5)
        </button>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/20 rounded-control p-3">
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-success/10 border border-success/20 rounded-control p-3">
          <p className="text-sm text-success">{success}</p>
        </div>
      )}

      {/* Send Pix */}
      {tab === 'send' && (
        <Card>
          <h2 className="text-base font-semibold text-text-primary mb-4">Enviar Pix</h2>
          <form onSubmit={handleSendPix} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">Tipo de chave</label>
              <select
                value={keyType}
                onChange={(e) => setKeyType(e.target.value)}
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-control text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-lime/40"
              >
                <option value="cpf">CPF</option>
                <option value="email">E-mail</option>
                <option value="phone">Telefone</option>
                <option value="random">Chave aleatória</option>
              </select>
            </div>
            <Input
              label="Chave Pix"
              placeholder="Informe a chave do destinatário"
              value={keyValue}
              onChange={(e) => setKeyValue(e.target.value)}
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
              placeholder="Ex: Almoço"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button type="submit" className="w-full" isLoading={loading}>
              Enviar Pix
            </Button>
          </form>
        </Card>
      )}

      {/* Pix Keys */}
      {tab === 'keys' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-text-primary">Minhas Chaves Pix</h2>
            <Button size="sm" onClick={() => setShowNewKey(true)} disabled={keys.length >= 5}>
              <Plus size={16} className="mr-1" />
              Nova chave
            </Button>
          </div>

          {keys.length === 0 ? (
            <p className="text-sm text-text-tertiary text-center py-6">Nenhuma chave Pix cadastrada</p>
          ) : (
            <div className="space-y-3">
              {keys.map((key) => (
                <div key={key.id} className="flex items-center justify-between p-3 bg-secondary rounded-control">
                  <div>
                    <Badge variant="lime">{keyTypeLabels[key.type] || key.type}</Badge>
                    <p className="text-sm text-text-primary mt-1">{key.value}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteKey(key.id)}
                    className="text-text-tertiary hover:text-danger transition-colors p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* New Key Modal */}
      <Modal isOpen={showNewKey} onClose={() => setShowNewKey(false)} title="Nova Chave Pix">
        <form onSubmit={handleCreateKey} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-secondary">Tipo</label>
            <select
              value={newKeyType}
              onChange={(e) => setNewKeyType(e.target.value)}
              className="w-full px-4 py-2.5 bg-secondary border border-border rounded-control text-text-primary text-sm"
            >
              <option value="email">E-mail</option>
              <option value="cpf">CPF</option>
              <option value="phone">Telefone</option>
              <option value="random">Aleatória</option>
            </select>
          </div>
          <Input
            label="Valor da chave"
            placeholder="Ex: seu@email.com"
            value={newKeyValue}
            onChange={(e) => setNewKeyValue(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" isLoading={loading}>
            Criar Chave
          </Button>
        </form>
      </Modal>

      {/* Receipt Modal */}
      <Modal isOpen={!!receipt} onClose={() => setReceipt(null)} title="Comprovante Pix">
        {receipt && (
          <div className="space-y-4">
            <div className="bg-success/10 border border-success/20 rounded-control p-4 text-center">
              <p className="text-sm text-success font-medium">Pix enviado com sucesso!</p>
              <p className="text-2xl font-bold text-text-primary mt-2">{formatBRL(receipt.amount)}</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-text-tertiary">ID da transação</span>
                <span className="text-text-primary font-mono text-xs">{receipt.transactionId.slice(0, 8)}...</span>
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
