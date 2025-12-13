import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { FileText } from 'lucide-react'
import { useSdk } from '../../../shared/hooks/useSdk'
import { DATA_CONTRACT_IDENTIFIER, DOCUMENT_TYPE } from '../../../config/constants'
import type { Torrent } from '../types'
import type { WalletInfo } from '../../wallet/types'
import { createTorrent } from '../types'
import { TorrentCard } from './TorrentCard'
import { TorrentCardSkeleton } from './TorrentCardSkeleton'
import { TorrentListItem } from './TorrentListItem'
import { TorrentListItemSkeleton } from './TorrentListItemSkeleton'

interface OutletContext {
  walletInfo: WalletInfo
  activeCategory: string
  searchQuery: string
  setPageTitle: (title: string | undefined) => void
  setTorrentCount: (count: number | undefined) => void
  showMyTorrents: boolean
  refreshKey: number
  viewMode: 'grid' | 'list'
  sortOrder: 'desc' | 'asc'
}

export const TorrentList = () => {
  const { walletInfo, searchQuery, setPageTitle, setTorrentCount, showMyTorrents, refreshKey, viewMode, sortOrder } = useOutletContext<OutletContext>()
  const [torrents, setTorrents] = useState<Torrent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTorrents = async () => {
      setLoading(true)

      try {
        const sdk = useSdk()
        const limit = 100

        const documents = await sdk.documents.query(
          DATA_CONTRACT_IDENTIFIER,
          DOCUMENT_TYPE,
          undefined,
          undefined,
          limit
        )

        const mappedTorrents = documents.map((_document) => {
          const properties = _document.properties as {
            name: string
            description: string
            magnet: string
          }
          return createTorrent(
            _document.id.base58(),
            properties.name,
            properties.description,
            properties.magnet,
            _document.ownerId.base58(),
            new Date(parseInt(_document.updatedAt?.toString() ?? '0'))
          )
        })

        setTorrents(mappedTorrents)
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    }

    fetchTorrents()
  }, [refreshKey])

  const filteredTorrents = torrents
    .filter((_torrent) =>
      _torrent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      _torrent.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((_torrent) =>
      showMyTorrents
        ? _torrent.owner === walletInfo.currentIdentity
        : true
    )
    .sort((a, b) =>
      sortOrder === 'desc'
        ? b.timestamp.getTime() - a.timestamp.getTime()  // Новые первыми
        : a.timestamp.getTime() - b.timestamp.getTime()  // Старые первыми
    )

  // Set title immediately (doesn't depend on loading)
  useEffect(() => {
    setPageTitle('All Torrents')
    return () => setPageTitle(undefined)
  }, [setPageTitle])

  // Set count only after loading (undefined shows skeleton)
  useEffect(() => {
    setTorrentCount(!loading && !error ? filteredTorrents.length : undefined)
    return () => setTorrentCount(undefined)
  }, [loading, error, filteredTorrents.length, setTorrentCount])

  return (
    <div className="space-y-6">
      {/* Loading state — skeleton grid or list */}
      {loading && (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <TorrentCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <TorrentListItemSkeleton key={i} />
            ))}
          </div>
        )
      )}

      {/* Empty state */}
      {!loading && !error && filteredTorrents.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-dash-dark-75 dark:text-dash-white-75" />
          <h3 className="mt-2 text-sm font-medium text-dash-dark dark:text-dash-white">No torrents</h3>
          <p className="mt-1 text-sm text-dash-dark-75 dark:text-dash-white-75">
            {searchQuery
              ? 'No torrents match your search.'
              : walletInfo.connected
                ? 'Click "New Torrent" in the sidebar to add your first torrent.'
                : 'Connect your wallet to add torrents.'}
          </p>
        </div>
      )}

      {/* Grid or List of torrents */}
      {!loading && !error && filteredTorrents.length > 0 && (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTorrents.map((_torrent) => (
              <TorrentCard
                key={_torrent.identifier}
                torrent={_torrent}
                walletInfo={walletInfo}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredTorrents.map((_torrent) => (
              <TorrentListItem
                key={_torrent.identifier}
                torrent={_torrent}
                walletInfo={walletInfo}
              />
            ))}
          </div>
        )
      )}

      {/* Error state */}
      {error && (
        <div className="rounded-lg bg-error-5 dark:bg-error-15 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-error dark:text-error-75">Error loading torrents</h3>
              <div className="mt-2 text-sm text-error-75">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
