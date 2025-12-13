import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import clsx from 'clsx'

type InputVariant = 'background' | 'bordered'
type InputSize = 'small' | 'medium' | 'big'

interface InputProps extends Omit<ComponentPropsWithoutRef<'input'>, 'size'> {
  variant?: InputVariant
  size?: InputSize
  rounded?: 'full' | 'xl'
  error?: string | boolean
  icon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'background', size = 'medium', rounded = 'xl', error, icon, className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {/* Icon */}
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dash-dark-75 dark:text-dash-white-75 pointer-events-none [&>svg]:w-4 [&>svg]:h-4">
            {icon}
          </span>
        )}

        {/* Input */}
        <input
          ref={ref}
          className={clsx(
            // Base
            'w-full border outline-none transition-colors',
            rounded === 'full' ? 'rounded-full' : 'rounded-xl',
            'text-dash-dark dark:text-dash-white font-semibold',
            'placeholder:text-dash-dark-75 dark:placeholder:text-dash-white-75',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            // Size
            size === 'small' && 'h-8 text-sm px-4',
            size === 'medium' && 'h-10 text-base px-5',
            size === 'big' && 'h-14 text-lg px-6',
            // Icon padding
            icon && 'pl-10',
            // Variant
            variant === 'background' && 'bg-dash-dark-5 dark:bg-dash-white-15 border-transparent focus:border-dash-dark-15 dark:focus:border-dash-white-15',
            variant === 'bordered' && 'bg-transparent border-dash-dark-15 dark:border-dash-white-15 focus:border-dash-blue',
            // Error
            error && 'border-error focus:border-error',
            className
          )}
          {...props}
        />

        {/* Error message */}
        {typeof error === 'string' && error && (
          <p className="mt-1 text-sm text-error">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
