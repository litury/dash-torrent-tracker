import { useEffect, useState } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import { ArrowLeft, Copy, Check, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { useSdk } from '../../../shared/hooks/useSdk'
import { DATA_CONTRACT_IDENTIFIER, DOCUMENT_TYPE } from '../../../config/constants'
import type { Torrent } from '../types'
import type { WalletInfo } from '../../wallet/types'
import { createTorrent } from '../types'
import { OwnerIdentity } from '../parts/OwnerIdentity'
import { DocumentIdenticon } from '../parts/DocumentIdenticon'
import { MagnetButton } from '../parts/MagnetButton'
import { TorrentActions } from '../parts/TorrentActions'
import { UpdateTorrentModal } from '../parts/UpdateTorrentModal'
import { DeleteTorrentModal } from '../parts/DeleteTorrentModal'

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-dash-dark-15 dark:border-dash-white-15" />
          <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-t-dash-blue animate-spin" />
        </div>
        <p className="mt-4 text-sm text-dash-dark-75 dark:text-dash-white-75">Loading torrent...</p>
      </div>
    )
  }

  if (error || !torrent) {
    return (
      <div className="text-center py-12">
        <p className="text-error">{error || 'Torrent not found'}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-dash-blue hover:underline"
        >
          Back to torrents
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-dash-dark-75 dark:text-dash-white-75 hover:text-dash-dark dark:hover:text-dash-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <TorrentActions
          torrent={torrent}
          isOwner={isOwner}
          onEdit={setEditingTorrent}
          onDelete={setDeletingTorrent}
        />
      </div>

      {/* Main content */}
      <div className="bg-dash-white dark:bg-dash-space-cadet rounded-xl border border-dash-dark-15 dark:border-dash-white-15 overflow-hidden">
        {/* Title section */}
        <div className="p-6 border-b border-dash-dark-15 dark:border-dash-white-15">
          <div className="flex gap-4">
            <DocumentIdenticon documentId={torrent.identifier} size="lg" />

            <div className="flex-1">
              <h1 className="text-xl font-bold text-dash-dark dark:text-dash-white">
                {torrent.name}
              </h1>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-6 border-b border-dash-dark-15 dark:border-dash-white-15">
          <p className="text-dash-dark-75 dark:text-dash-white-75 whitespace-pre-wrap">
            {torrent.description}
          </p>
        </div>

        {/* Download button */}
        <div className="p-6 border-b border-dash-dark-15 dark:border-dash-white-15">
          <MagnetButton magnet={torrent.magnet} />
        </div>

        {/* Metadata */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-dash-dark-5 dark:border-dash-white-5">
            <span className="text-sm text-dash-dark-75 dark:text-dash-white-75">Owner</span>
            <OwnerIdentity owner={torrent.owner} isOwner={isOwner} size="sm" />
          </div>

          <div className="flex items-center justify-between py-2 border-b border-dash-dark-5 dark:border-dash-white-5">
            <span className="text-sm text-dash-dark-75 dark:text-dash-white-75">Added</span>
            <span className="text-sm text-dash-dark dark:text-dash-white">
              {formatFullDate(torrent.timestamp)}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-dash-dark-5 dark:border-dash-white-5">
            <span className="text-sm text-dash-dark-75 dark:text-dash-white-75">Document ID</span>
            <button
              onClick={handleCopyId}
              className="flex items-center gap-2 text-sm font-mono text-dash-dark dark:text-dash-white hover:text-dash-blue transition-colors"
            >
              {torrent.identifier.slice(0, 8)}...{torrent.identifier.slice(-4)}
              {copiedId ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-dash-dark-75 dark:text-dash-white-75">Explorer</span>
            <a
              href={`https://testnet.platform-explorer.com/document/${torrent.identifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-dash-blue hover:underline"
            >
              View on Platform Explorer
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

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
