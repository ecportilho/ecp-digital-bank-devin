import { type HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'highlight'
}

export function Card({ variant = 'default', className, children, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-card p-5',
        {
          'bg-surface border border-border': variant === 'default',
          'bg-surface border border-lime/20': variant === 'highlight',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
