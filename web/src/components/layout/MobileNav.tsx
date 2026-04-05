import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Zap,
  ArrowLeftRight,
  CreditCard,
  User,
} from 'lucide-react'
import { clsx } from 'clsx'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/pix', icon: Zap, label: 'Pix' },
  { to: '/extrato', icon: ArrowLeftRight, label: 'Extrato' },
  { to: '/cartoes', icon: CreditCard, label: 'Cartões' },
  { to: '/perfil', icon: User, label: 'Perfil' },
]

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-40">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center gap-1 px-3 py-1.5 text-xs transition-colors',
                isActive ? 'text-lime' : 'text-text-tertiary'
              )
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
