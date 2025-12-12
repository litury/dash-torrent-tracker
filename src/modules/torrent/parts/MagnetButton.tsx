import { useState } from 'react'
import { Magnet, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import clsx from 'clsx'

interface MagnetButtonProps {
  magnet: string
  compact?: boolean
}

export const MagnetButton = ({ magnet, compact = false }: MagnetButtonProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    await navigator.clipboard.writeText(magnet)
    setCopied(true)
    toast.success('Magnet link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="inline-flex items-center rounded-lg overflow-hidden border border-dash-dark-15 dark:border-dash-white-15">
      <a
        href={magnet}
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          "flex items-center gap-2 px-3 py-2",
          "bg-dash-blue text-white",
          "hover:bg-dash-blue-75 transition-colors",
          "text-sm font-medium"
        )}
      >
        <Magnet className="w-4 h-4" />
        {!compact && <span>Download</span>}
      </a>

      <button
        onClick={handleCopy}
        className={clsx(
          "flex items-center justify-center px-3 py-2",
          "bg-dash-white dark:bg-dash-space-cadet",
          "hover:bg-dash-dark-5 dark:hover:bg-dash-white-15",
          "transition-colors border-l border-dash-dark-15 dark:border-dash-white-15",
          copied && "text-success"
        )}
        title="Copy magnet link"
      >
        {copied ? (
          <Check className="w-4 h-4" />
        ) : (
          <Copy className="w-4 h-4 text-dash-dark-75 dark:text-dash-white-75" />
        )}
      </button>
    </div>
  )
}
