import { forwardRef, type ReactNode, type ComponentPropsWithoutRef } from 'react'
import clsx from 'clsx'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'alternative' | 'ghost'
  color?: 'white' | 'blue' | 'darkBlue' | 'error'
  size?: 'huge' | 'big' | 'medium' | 'small'
  radius?: 'round' | 'beveled'
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  iconOnly?: boolean
  loading?: boolean
}

const sizeStyles = {
  huge: { padding: 'px-6 py-4', paddingIconOnly: 'p-4', text: 'text-base', icon: '[&_svg]:size-6', gap: 'gap-2.5' },
  big: { padding: 'px-5 py-3', paddingIconOnly: 'p-3', text: 'text-base', icon: '[&_svg]:size-5', gap: 'gap-2' },
  medium: { padding: 'px-4 py-2.5', paddingIconOnly: 'p-2.5', text: 'text-sm', icon: '[&_svg]:size-[18px]', gap: 'gap-2' },
  small: { padding: 'px-3 py-2', paddingIconOnly: 'p-2', text: 'text-xs', icon: '[&_svg]:size-4', gap: 'gap-1.5' },
} as const

const radiusStyles = {
  round: 'rounded-full',
  beveled: 'rounded-[20px]',
} as const

const colorStyles = {
  primary: {
    white: 'bg-dash-white text-dash-blue hover:bg-dash-blue hover:text-dash-white shadow-sm',
    blue: 'bg-dash-blue text-dash-white hover:bg-dash-light-blue shadow-sm',
    darkBlue: 'bg-dash-space-cadet text-dash-white hover:bg-dash-dark shadow-sm',
    error: 'bg-error text-dash-white hover:bg-error-75 shadow-sm',
  },
  alternative: {
    white: 'bg-dash-white-15 text-dash-white hover:bg-dash-blue-75 shadow-sm',
    blue: 'bg-dash-blue-15 text-dash-blue hover:bg-dash-white-15 shadow-sm',
    darkBlue: 'bg-dash-dark-15 dark:bg-dash-white-15 text-dash-dark dark:text-dash-white hover:bg-dash-dark-25 dark:hover:bg-dash-white-25 shadow-sm',
    error: 'bg-error-15 text-error hover:bg-error-25 shadow-sm',
  },
  ghost: {
    white: 'text-dash-white hover:bg-dash-white-15',
    blue: 'text-dash-blue hover:bg-dash-blue-15',
    darkBlue: 'text-dash-dark dark:text-dash-white hover:bg-dash-dark-15 dark:hover:bg-dash-white-15',
    error: 'text-error hover:bg-error-15',
  },
} as const

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', color = 'blue', size = 'medium', radius = 'round', icon, iconPosition = 'left', iconOnly = false, loading = false, disabled, className, children, ...props }, ref) => {
    const s = sizeStyles[size]
    const isDisabled = disabled || loading

    const iconEl = loading
      ? <Loader2 className="animate-spin" />
      : icon && <span className="flex-shrink-0 inline-flex">{icon}</span>

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={clsx(
          'inline-flex items-center justify-center font-semibold transition-colors',
          s.text, s.icon, s.gap,
          iconOnly ? s.paddingIconOnly : s.padding,
          radiusStyles[radius],
          colorStyles[variant][color],
          isDisabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {iconOnly ? iconEl : (
          <>
            {iconPosition === 'left' && iconEl}
            {children && <span>{children}</span>}
            {iconPosition === 'right' && iconEl}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
