import { useEffect, useState } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import { Copy, Check, ExternalLink, Pencil, Trash2, Clock, User } from 'lucide-react'
import { toast } from 'sonner'
import clsx from 'clsx'
import { useSdk } from '../../../shared/hooks/useSdk'
import { Button } from '../../../shared/components/Button'
import { DATA_CONTRACT_IDENTIFIER, DOCUMENT_TYPE } from '../../../config/constants'
import type { Torrent } from '../types'
import type { WalletInfo } from '../../wallet/types'
import { createTorrent } from '../types'
import { DocumentIdenticon } from '../parts/DocumentIdenticon'
import { MagnetButton } from '../parts/MagnetButton'
import { UpdateTorrentModal } from '../parts/UpdateTorrentModal'
import { DeleteTorrentModal } from '../parts/DeleteTorrentModal'
import { CommentSection } from '../../comment'
import { TorrentPageSkeleton } from '../parts/TorrentPageSkeleton'

interface OutletContext {
  walletInfo: WalletInfo
}

export const TorrentPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { walletInfo } = useOutletContext<OutletContext>()

  const [torrent, setTorrent] = useState<Torrent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState(false)

  const [editingTorrent, setEditingTorrent] = useState<Torrent | null>(null)
  const [deletingTorrent, setDeletingTorrent] = useState<Torrent | null>(null)

  const isOwner = walletInfo.connected && torrent?.owner === walletInfo.currentIdentity

  useEffect(() => {
    const fetchTorrent = async () => {
      if (!id) return

      setLoading(true)
      try {
        const sdk = useSdk()
        const where = [['$id', '==', id]]
        const [document] = await sdk.documents.query(DATA_CONTRACT_IDENTIFIER, DOCUMENT_TYPE, where)

        if (document) {
          const properties = document.properties as { name: string; description: string; magnet: string }
          setTorrent(
            createTorrent(
              document.id.base58(),
              properties.name,
              properties.description,
              properties.magnet,
              document.ownerId.base58(),
              new Date(parseInt(document.updatedAt?.toString() ?? '0'))
            )
          )
        } else {
          setError('Torrent not found')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    }

    fetchTorrent()
  }, [id])

  const handleCopyId = async () => {
    if (!torrent) return
    await navigator.clipboard.writeText(torrent.identifier)
    setCopiedId(true)
    toast.success('Document ID copied!')
    setTimeout(() => setCopiedId(false), 2000)
  }

  const handleTorrentUpdated = async (identifier: string) => {
    const sdk = useSdk()
    const where = [['$id', '==', identifier]]
    const [document] = await sdk.documents.query(DATA_CONTRACT_IDENTIFIER, DOCUMENT_TYPE, where)

    if (document) {
      const properties = document.properties as { name: string; description: string; magnet: string }
      setTorrent(
        createTorrent(
          document.id.base58(),
          properties.name,
          properties.description,
          properties.magnet,
          document.ownerId.base58(),
          new Date(parseInt(document.updatedAt?.toString() ?? '0'))
        )
      )
    }
    setEditingTorrent(null)
  }

  const handleTorrentDeleted = () => {
    setDeletingTorrent(null)
    navigate('/')
  }

  const formatFullDate = (timestamp: Date): string => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatShortDate = (timestamp: Date): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatIdentity = (identity: string): string => {
    if (identity.length <= 12) return identity
    return `${identity.slice(0, 6)}...${identity.slice(-4)}`
  }

  if (loading) {
    return <TorrentPageSkeleton />
  }

  if (error || !torrent) {
    return (
      <div className="text-center py-12">
        <p className="text-error">{error || 'Torrent not found'}</p>
        <Button
          variant="ghost"
          color="blue"
          size="small"
          onClick={() => navigate('/')}
          className="mt-4"
        >
          Back to torrents
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Card */}
      <div className="bg-dash-white dark:bg-dash-space-cadet rounded-xl border border-dash-dark-15 dark:border-dash-white-15 overflow-hidden">
        {/* Header: Icon + Title + Actions - vertical on mobile */}
        <div className="p-4 sm:p-6 border-b border-dash-dark-5 dark:border-dash-white-5">
          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
            <DocumentIdenticon documentId={torrent.identifier} size="lg" />
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-dash-dark dark:text-dash-white break-words">
                {torrent.name}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-2 text-sm text-dash-dark-75 dark:text-dash-white-75">
                <div className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className={clsx(
                    "font-mono",
                    isOwner ? "text-dash-blue font-medium" : ""
                  )}>
                    {isOwner ? "You" : formatIdentity(torrent.owner)}
                  </span>
                </div>
                <span className="hidden sm:inline text-dash-dark-50 dark:text-dash-white-50">•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{formatShortDate(torrent.timestamp)}</span>
                </div>
              </div>
            </div>
            {/* Action buttons - always rendered, invisible when not owner to prevent layout shift */}
            <div className={`flex gap-2 w-full sm:w-auto sm:flex-shrink-0 ${!isOwner ? 'invisible' : ''}`}>
              <Button
                variant="alternative"
                color="darkBlue"
                size="small"
                icon={<Pencil />}
                onClick={() => setEditingTorrent(torrent)}
                className="flex-1 sm:flex-initial"
              >
                Edit
              </Button>
              <Button
                variant="alternative"
                color="error"
                size="small"
                icon={<Trash2 />}
                onClick={() => setDeletingTorrent(torrent)}
                className="flex-1 sm:flex-initial"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-4 sm:p-6 border-b border-dash-dark-5 dark:border-dash-white-5">
          <h2 className="text-xs font-medium text-dash-dark-50 dark:text-dash-white-50 uppercase tracking-wide mb-3">
            Description
          </h2>
          <p className="text-sm text-dash-dark dark:text-dash-white whitespace-pre-wrap leading-relaxed break-words [overflow-wrap:anywhere]">
            {torrent.description}
          </p>
        </div>

        {/* Download CTA */}
        <div className="p-4 sm:p-6 border-b border-dash-dark-5 dark:border-dash-white-5">
          <MagnetButton magnet={torrent.magnet} />
        </div>

        {/* Metadata Grid */}
        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Document ID */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-dash-dark-50 dark:text-dash-white-50 uppercase tracking-wide">
              Document ID
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-dash-dark dark:text-dash-white">
                {torrent.identifier.slice(0, 8)}...{torrent.identifier.slice(-4)}
              </span>
              <Button
                variant="ghost"
                color="darkBlue"
                size="small"
                iconOnly
                icon={copiedId ? <Check className="text-success" /> : <Copy />}
                onClick={handleCopyId}
                title="Copy identifier"
              />
              <a
                href={`https://testnet.platform-explorer.com/document/${torrent.identifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-dash-dark-5 dark:hover:bg-dash-white-15 transition-colors"
                title="View on Platform Explorer"
              >
                <ExternalLink className="w-4 h-4 text-dash-blue" />
              </a>
            </div>
          </div>

          {/* Owner */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-dash-dark-50 dark:text-dash-white-50 uppercase tracking-wide">
              Owner
            </span>
            <div className="flex items-center gap-2">
              <span className={clsx(
                "font-mono text-sm",
                isOwner
                  ? "text-dash-blue font-medium"
                  : "text-dash-dark dark:text-dash-white"
              )}>
                {isOwner ? "You" : formatIdentity(torrent.owner)}
              </span>
              <a
                href={`https://testnet.platform-explorer.com/identity/${torrent.owner}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-dash-dark-5 dark:hover:bg-dash-white-15 transition-colors"
                title="View owner on Platform Explorer"
              >
                <ExternalLink className="w-4 h-4 text-dash-blue" />
              </a>
            </div>
          </div>

          {/* Timestamp */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-dash-dark-50 dark:text-dash-white-50 uppercase tracking-wide">
              Added
            </span>
            <span className="text-sm text-dash-dark dark:text-dash-white">
              {formatFullDate(torrent.timestamp)}
            </span>
          </div>

          {/* Platform Explorer */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-dash-dark-50 dark:text-dash-white-50 uppercase tracking-wide">
              Platform Explorer
            </span>
            <a
              href={`https://testnet.platform-explorer.com/document/${torrent.identifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-dash-blue hover:underline inline-flex items-center gap-1"
            >
              View document
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <CommentSection torrentId={torrent.identifier} walletInfo={walletInfo} />

      {/* Modals */}
      {editingTorrent && (
        <UpdateTorrentModal
          torrent={editingTorrent}
          walletInfo={walletInfo}
          isOpen={!!editingTorrent}
          onClose={() => setEditingTorrent(null)}
          onUpdate={handleTorrentUpdated}
        />
      )}

      {deletingTorrent && (
        <DeleteTorrentModal
          torrent={deletingTorrent}
          walletInfo={walletInfo}
          isOpen={!!deletingTorrent}
          onClose={() => setDeletingTorrent(null)}
          onDelete={handleTorrentDeleted}
        />
      )}
    </div>
  )
}
