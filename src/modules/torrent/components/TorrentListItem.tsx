import { useNavigate } from 'react-router-dom'
import { DocumentIdenticon } from '../parts/DocumentIdenticon'
import type { Torrent } from '../types'
import type { WalletInfo } from '../../wallet/types'

interface TorrentListItemProps {
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

export const TorrentListItem = ({ torrent, walletInfo }: TorrentListItemProps) => {
  const navigate = useNavigate()
  const isOwner = walletInfo.connected && torrent.owner === walletInfo.currentIdentity

  return (
    <article
      onClick={() => navigate(`/torrent/${torrent.identifier}`)}
      className="flex items-center gap-4 px-4 py-3 rounded-lg bg-dash-white dark:bg-dash-space-cadet border border-dash-dark-15 dark:border-dash-white-15 hover:border-dash-blue transition-colors cursor-pointer"
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <DocumentIdenticon documentId={torrent.identifier} size="sm" />
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-dash-dark dark:text-dash-white truncate">
          {torrent.name}
        </h3>
      </div>

      {/* Description */}
      <div className="flex-1 min-w-0 hidden md:block">
        <p className="text-sm text-dash-dark-75 dark:text-dash-white-75 truncate">
          {torrent.description}
        </p>
      </div>

      {/* Owner */}
      <div className="flex-shrink-0 hidden lg:block w-20">
        <span className="text-xs text-dash-dark-75 dark:text-dash-white-75 inline-block w-full text-center">
          {isOwner ? 'You' : `${torrent.owner.slice(0, 6)}...${torrent.owner.slice(-4)}`}
        </span>
      </div>

      {/* Date */}
      <div className="flex-shrink-0">
        <span className="text-xs text-dash-dark-75 dark:text-dash-white-75">
          {formatDate(torrent.timestamp)}
        </span>
      </div>
    </article>
  )
}
