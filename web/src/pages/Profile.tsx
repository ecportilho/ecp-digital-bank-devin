import { useState } from 'react'
import { User, Save, Trash2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { api, ApiError } from '@/lib/api'
import { formatCPF } from '@/lib/format'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'

export function ProfilePage() {
  const { user, token, logout } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [showDelete, setShowDelete] = useState(false)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await api('/users/me', {
        method: 'PATCH',
        token: token!,
        body: { name },
      })
      setSuccess('Perfil atualizado com sucesso')
    } catch (err) {
      if (err instanceof ApiError) setError(err.message)
      else setError('Erro ao atualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await api('/users/me', { method: 'DELETE', token: token! })
      logout()
    } catch (err) {
      if (err instanceof ApiError) setError(err.message)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <User size={28} className="text-text-primary" />
        <h1 className="text-2xl font-bold text-text-primary">Perfil</h1>
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

      <Card>
        <h2 className="text-base font-semibold text-text-primary mb-4">Dados pessoais</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <Input
            label="Nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-secondary">CPF</label>
            <p className="text-sm text-text-tertiary px-4 py-2.5 bg-secondary border border-border rounded-control">
              {user?.cpf ? formatCPF(user.cpf) : '—'}
            </p>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-secondary">E-mail</label>
            <p className="text-sm text-text-tertiary px-4 py-2.5 bg-secondary border border-border rounded-control">
              {user?.email || '—'}
            </p>
          </div>
          <Button type="submit" isLoading={loading}>
            <Save size={16} className="mr-1" />
            Salvar alterações
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-base font-semibold text-danger mb-2">Zona de perigo</h2>
        <p className="text-sm text-text-tertiary mb-4">
          Ao excluir sua conta, todos os dados serão desativados. Esta ação não pode ser desfeita.
        </p>
        <Button variant="danger" onClick={() => setShowDelete(true)}>
          <Trash2 size={16} className="mr-1" />
          Excluir conta
        </Button>
      </Card>

      <Modal isOpen={showDelete} onClose={() => setShowDelete(false)} title="Excluir conta">
        <p className="text-sm text-text-secondary mb-4">
          Tem certeza que deseja excluir sua conta? Esta ação desativará seu acesso e dados.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setShowDelete(false)}>
            Cancelar
          </Button>
          <Button variant="danger" className="flex-1" onClick={handleDeleteAccount}>
            Confirmar exclusão
          </Button>
        </div>
      </Modal>
    </div>
  )
}
