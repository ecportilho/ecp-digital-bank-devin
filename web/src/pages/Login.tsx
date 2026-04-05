import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ApiError } from '@/lib/api'

export function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isLoading) return null
  if (isAuthenticated) return <Navigate to="/" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Erro ao fazer login')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-lime mb-2">ECP Bank</h1>
          <p className="text-text-secondary text-sm">Digital Banking</p>
        </div>

        <div className="bg-surface border border-border rounded-card p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-6">Entrar</h2>

          {error && (
            <div className="bg-danger/10 border border-danger/20 rounded-control p-3 mb-4">
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Senha"
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" isLoading={loading}>
              Entrar
            </Button>
          </form>

          <p className="text-center text-sm text-text-tertiary mt-4">
            Não tem conta?{' '}
            <Link to="/register" className="text-lime hover:text-lime-pressed transition-colors">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
