import { type ReactNode } from 'react'
import { X } from 'lucide-react'
import clsx from 'clsx'
import { Button } from './Button'

type ModalSize = 'sm' | 'md' | 'lg'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  size?: ModalSize
  showCloseButton?: boolean
  headless?: boolean
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl'
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  headless = false
}: ModalProps) => {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto lg:pl-64">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className={clsx(
              'relative w-full bg-dash-white dark:bg-dash-space-cadet rounded-xl shadow-2xl',
              sizeClasses[size]
            )}
          >
            {/* Header (only if not headless) */}
            {!headless && title && (
              <div className="border-b border-dash-dark-15 dark:border-dash-white-15 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-dash-dark dark:text-dash-white">
                    {title}
                  </h3>
                  {showCloseButton && (
                    <Button
                      variant="ghost"
                      color="darkBlue"
                      size="small"
                      iconOnly
                      icon={<X />}
                      onClick={onClose}
                    />
                  )}
                </div>
                {description && (
                  <p className="mt-1 text-sm text-dash-dark-75 dark:text-dash-white-75">
                    {description}
                  </p>
                )}
              </div>
            )}

            {/* Content */}
            <div className={headless ? '' : 'p-6'}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
