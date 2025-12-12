import { useEffect, useState } from 'react'
import { NavLink, useOutletContext } from 'react-router-dom'
import { FileText, Plus } from 'lucide-react'
import { useSdk } from '../../../shared/hooks/useSdk'
import { DATA_CONTRACT_IDENTIFIER, DOCUMENT_TYPE } from '../../../config/constants'
import type { Torrent } from '../types'
import type { WalletInfo } from '../../wallet/types'
import { createTorrent } from '../types'
import { TorrentCard } from './TorrentCard'
import { TorrentCardSkeleton } from './TorrentCardSkeleton'

interface OutletContext {
  walletInfo: WalletInfo
  activeCategory: string
  searchQuery: string
  setPageTitle: (title: string | undefined) => void
  setTorrentCount: (count: number | undefined) => void
  ownerFilter: 'all' | 'mine'
}

export const TorrentList = () => {
  const { walletInfo, searchQuery, setPageTitle, setTorrentCount, ownerFilter } = useOutletContext<OutletContext>()
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
  }, [])

  const filteredTorrents = torrents
    .filter((_torrent) =>
      _torrent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      _torrent.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((_torrent) =>
      ownerFilter === 'mine'
        ? _torrent.owner === walletInfo.currentIdentity
        : true
    )
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  // Update header title and count
  useEffect(() => {
    if (!loading && !error) {
      let title = 'All Torrents'
      if (searchQuery) {
        title = `Results for "${searchQuery}"`
      } else if (ownerFilter === 'mine') {
        title = 'My Torrents'
      }
      setPageTitle(title)
      setTorrentCount(filteredTorrents.length)
    }
    return () => {
      setPageTitle(undefined)
      setTorrentCount(undefined)
    }
  }, [loading, error, searchQuery, ownerFilter, filteredTorrents.length, setPageTitle, setTorrentCount])

  return (
    <div className="space-y-6">
      {/* Loading state — skeleton grid */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <TorrentCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredTorrents.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-dash-dark-75 dark:text-dash-white-75" />
          <h3 className="mt-2 text-sm font-medium text-dash-dark dark:text-dash-white">No torrents</h3>
          <p className="mt-1 text-sm text-dash-dark-75 dark:text-dash-white-75">
            {searchQuery ? 'No torrents match your search.' : 'Get started by adding a new torrent.'}
          </p>
          {!searchQuery && walletInfo.connected && (
            <div className="mt-6">
              <NavLink
                to="/add"
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-dash-white bg-dash-blue hover:bg-dash-blue-75 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add your first torrent
              </NavLink>
            </div>
          )}
        </div>
      )}

      {/* Grid of cards */}
      {!loading && !error && filteredTorrents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTorrents.map((_torrent) => (
            <TorrentCard
              key={_torrent.identifier}
              torrent={_torrent}
              walletInfo={walletInfo}
            />
          ))}
        </div>
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
