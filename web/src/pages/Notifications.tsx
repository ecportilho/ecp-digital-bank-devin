import { useState, useEffect } from 'react'
import { Bell, Check } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/format'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface Notification {
  id: string
  title: string
  body: string
  type: string
  read: boolean
  createdAt: string
}

const typeBadge: Record<string, 'success' | 'warning' | 'info' | 'neutral'> = {
  pix_received: 'success',
  payment_confirmed: 'info',
  card_blocked: 'warning',
  general: 'neutral',
}

export function NotificationsPage() {
  const { token } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    api<Notification[]>('/users/me/notifications', { token })
      .then(setNotifications)
      .finally(() => setLoading(false))
  }, [token])

  const markAsRead = async (id: string) => {
    await api(`/users/me/notifications/${id}/read`, { method: 'PATCH', token: token! })
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Bell size={28} className="text-text-primary" />
        <h1 className="text-2xl font-bold text-text-primary">Notificações</h1>
        {unreadCount > 0 && <Badge variant="lime">{unreadCount} nova(s)</Badge>}
      </div>

      {loading ? (
        <p className="text-sm text-text-tertiary text-center py-8">Carregando...</p>
      ) : notifications.length === 0 ? (
        <Card>
          <p className="text-sm text-text-tertiary text-center py-8">Nenhuma notificação</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => (
            <Card
              key={notif.id}
              className={notif.read ? 'opacity-60' : ''}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-text-primary">{notif.title}</h3>
                    <Badge variant={typeBadge[notif.type] || 'neutral'}>{notif.type}</Badge>
                    {!notif.read && <span className="w-2 h-2 rounded-full bg-lime" />}
                  </div>
                  <p className="text-sm text-text-secondary">{notif.body}</p>
                  <p className="text-xs text-text-tertiary mt-1">{formatDate(notif.createdAt)}</p>
                </div>
                {!notif.read && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="text-text-tertiary hover:text-lime transition-colors p-2"
                    title="Marcar como lida"
                  >
                    <Check size={16} />
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
