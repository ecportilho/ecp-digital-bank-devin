import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { api } from '@/lib/api'

interface User {
  id: string
  name: string
  email: string
  cpf: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, cpf: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ecp_token'))
  const [isLoading, setIsLoading] = useState(true)

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('ecp_token')
  }, [])

  useEffect(() => {
    if (token) {
      api<User>('/users/me', { token })
        .then(setUser)
        .catch(() => logout())
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [token, logout])

  const login = async (email: string, password: string) => {
    const result = await api<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    setToken(result.token)
    setUser(result.user)
    localStorage.setItem('ecp_token', result.token)
  }

  const register = async (name: string, cpf: string, email: string, password: string) => {
    const result = await api<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: { name, cpf, email, password },
    })
    setToken(result.token)
    setUser(result.user)
    localStorage.setItem('ecp_token', result.token)
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
