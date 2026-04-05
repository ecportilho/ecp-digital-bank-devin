import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Zap,
  CreditCard,
  Receipt,
  User,
  LogOut,
  Bell,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { clsx } from 'clsx'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/pix', icon: Zap, label: 'Pix' },
  { to: '/extrato', icon: ArrowLeftRight, label: 'Extrato' },
  { to: '/cartoes', icon: CreditCard, label: 'Cartões' },
  { to: '/pagamentos', icon: Receipt, label: 'Pagamentos' },
  { to: '/perfil', icon: User, label: 'Perfil' },
  { to: '/notificacoes', icon: Bell, label: 'Notificações' },
]

export function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-surface border-r border-border min-h-screen">
      <div className="p-5 border-b border-border">
        <h1 className="text-xl font-bold text-lime">ECP Bank</h1>
        <p className="text-xs text-text-tertiary mt-1">Digital Banking</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-2.5 rounded-control text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-lime/10 text-lime'
                  : 'text-text-secondary hover:text-text-primary hover:bg-secondary'
              )
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-lime/20 flex items-center justify-center text-lime text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{user?.name}</p>
            <p className="text-xs text-text-tertiary truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-text-tertiary hover:text-danger transition-colors rounded-control hover:bg-danger/5"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  )
}
