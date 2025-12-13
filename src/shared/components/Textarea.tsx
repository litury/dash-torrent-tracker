import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import clsx from 'clsx'

type TextareaVariant = 'background' | 'bordered'
type TextareaSize = 'small' | 'medium' | 'big'

interface TextareaProps extends Omit<ComponentPropsWithoutRef<'textarea'>, 'size'> {
  variant?: TextareaVariant
  size?: TextareaSize
  error?: string | boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ variant = 'background', size = 'medium', error, className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <textarea
          ref={ref}
          className={clsx(
            // Base
            'w-full rounded-xl border outline-none transition-colors resize-none',
            'text-dash-dark dark:text-dash-white font-semibold',
            'placeholder:text-dash-dark-75 dark:placeholder:text-dash-white-75',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            // Size
            size === 'small' && 'text-sm px-4 py-2',
            size === 'medium' && 'text-base px-5 py-3',
            size === 'big' && 'text-lg px-6 py-4',
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

Textarea.displayName = 'Textarea'
