import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import type { Torrent } from '../types'
import type { WalletInfo } from '../../wallet/types'
import { DocumentIdenticon } from '../parts/DocumentIdenticon'

interface TorrentCardProps {
  torrent: Torrent
  walletInfo: WalletInfo
}

const formatDate = (timestamp: Date): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 1) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString()
}

export const TorrentCard = ({ torrent, walletInfo }: TorrentCardProps) => {
  const navigate = useNavigate()
  const isOwner = walletInfo.connected && torrent.owner === walletInfo.currentIdentity

  const handleClick = () => {
    navigate(`/torrent/${torrent.identifier}`)
  }

  return (
    <article
      onClick={handleClick}
      className={clsx(
        "relative flex flex-col h-full p-4 rounded-xl cursor-pointer transition-colors",
        "bg-dash-white dark:bg-dash-space-cadet",
        "border border-dash-dark-15 dark:border-dash-white-15",
        "hover:border-dash-blue dark:hover:border-dash-blue"
      )}
    >
      {/* Identicon — по центру */}
      <div className="flex justify-center mb-3">
        <DocumentIdenticon documentId={torrent.identifier} size="sm" />
      </div>

      {/* Title + Description — по центру */}
      <div className="text-center">
        <h3 className="text-truncate text-base font-semibold text-dash-dark dark:text-dash-white">
          {torrent.name}
        </h3>
        <p className="text-clamp-2 mt-1 text-sm text-dash-dark-75 dark:text-dash-white-75">
          {torrent.description}
        </p>
      </div>

      {/* Footer: Owner (left) + Date (right) */}
      <div className="mt-auto pt-4 flex items-center justify-between">
        <span className={clsx(
          "text-xs font-mono",
          isOwner ? "text-dash-blue font-medium" : "text-dash-dark-75 dark:text-dash-white-75"
        )}>
          {isOwner ? "You" : `${torrent.owner.slice(0, 3)}...${torrent.owner.slice(-3)}`}
        </span>
        <time className="text-xs font-mono text-dash-dark-75 dark:text-dash-white-75">
          {formatDate(torrent.timestamp)}
        </time>
      </div>
    </article>
  )
}
