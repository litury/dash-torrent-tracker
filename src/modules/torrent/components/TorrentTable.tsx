import { useEffect, useState } from 'react'
import { NavLink, useOutletContext } from 'react-router-dom'
import { FileText, Plus } from 'lucide-react'
import { useSdk } from '../../../shared/hooks/useSdk'
import { DATA_CONTRACT_IDENTIFIER, DOCUMENT_TYPE } from '../../../config/constants'
import type { Torrent } from '../types'
import type { WalletInfo } from '../../wallet/types'
import { createTorrent } from '../types'
import { TorrentRow } from './TorrentRow'

interface OutletContext {
  walletInfo: WalletInfo
  activeCategory: string
  searchQuery: string
}

export const TorrentTable = () => {
  const { walletInfo, searchQuery } = useOutletContext<OutletContext>()
  const [torrents, setTorrents] = useState<Torrent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTorrentsAsync = async () => {
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

    fetchTorrentsAsync()
  }, [])

  const filteredTorrents = torrents.filter((_torrent) =>
    _torrent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    _torrent.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative">
            <div className="h-12 w-12 rounded-full border-4 border-dash-dark-15 dark:border-dash-white-15" />
            <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-t-dash-blue animate-spin" />
          </div>
          <p className="mt-4 text-sm text-dash-dark-75 dark:text-dash-white-75">Loading torrents...</p>
        </div>
      )}

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

      {!loading && !error && filteredTorrents.length > 0 && (
        <div className="bg-dash-white dark:bg-dash-space-cadet shadow-xl rounded-xl overflow-x-auto">
          <table className="min-w-full divide-y divide-dash-dark-15 dark:divide-dash-white-15">
            <thead className="bg-dash-dark-5 dark:bg-dash-dark">
              <tr>
                <th scope="col" className="px-4 py-4 text-left text-xs font-medium text-dash-dark-75 dark:text-dash-white-75 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-4 py-4 text-left text-xs font-medium text-dash-dark-75 dark:text-dash-white-75 uppercase tracking-wider max-w-xs">
                  Description
                </th>
                <th scope="col" className="px-4 py-4 text-left text-xs font-medium text-dash-dark-75 dark:text-dash-white-75 uppercase tracking-wider">
                  Magnet
                </th>
                <th scope="col" className="px-4 py-4 text-left text-xs font-medium text-dash-dark-75 dark:text-dash-white-75 uppercase tracking-wider">
                  Added
                </th>
                <th scope="col" className="px-4 py-4 text-left text-xs font-medium text-dash-dark-75 dark:text-dash-white-75 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-dash-white dark:bg-dash-space-cadet divide-y divide-dash-dark-15 dark:divide-dash-white-15">
              {filteredTorrents.map((_torrent) => (
                <TorrentRow key={_torrent.identifier} torrent={_torrent} walletInfo={walletInfo} />
              ))}
            </tbody>
          </table>
        </div>
      )}

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
