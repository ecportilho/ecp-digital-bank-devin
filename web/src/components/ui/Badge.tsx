import { clsx } from 'clsx'

interface BadgeProps {
  variant?: 'lime' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  children: React.ReactNode
}

export function Badge({ variant = 'neutral', children }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-lime/10 text-lime': variant === 'lime',
          'bg-success/10 text-success': variant === 'success',
          'bg-warning/10 text-warning': variant === 'warning',
          'bg-danger/10 text-danger': variant === 'danger',
          'bg-info/10 text-info': variant === 'info',
          'bg-border text-text-secondary': variant === 'neutral',
        }
      )}
    >
      {children}
    </span>
  )
}
