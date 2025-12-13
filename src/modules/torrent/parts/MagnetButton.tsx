import { useState } from 'react'
import { Magnet, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '../../../shared/components/Button'

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
    <div className="inline-flex items-center gap-2">
      <Button
        size="small"
        icon={<Magnet />}
        onClick={(e) => {
          e.stopPropagation()
          window.location.href = magnet
        }}
      >
        {!compact && 'Download'}
      </Button>

      <Button
        variant="alternative"
        color="darkBlue"
        size="small"
        iconOnly
        icon={copied ? <Check className="text-success" /> : <Copy />}
        onClick={handleCopy}
        title="Copy magnet link"
      />
    </div>
  )
}
