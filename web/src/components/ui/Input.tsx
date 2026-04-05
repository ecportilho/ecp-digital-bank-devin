import { type InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full px-4 py-2.5 bg-secondary border rounded-control text-text-primary text-sm',
            'placeholder:text-text-tertiary',
            'focus:outline-none focus:ring-2 focus:ring-lime/40 focus:border-lime/40',
            'transition-all duration-200',
            error ? 'border-danger' : 'border-border',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-danger">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
