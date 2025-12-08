import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSdk } from '@shared/hooks/useSdk'
import { DATA_CONTRACT_IDENTIFIER, DOCUMENT_TYPE } from '@/config/constants'
import type { Torrent } from '../types'
import type { WalletInfo } from '@modules/wallet/types'
import { createTorrent } from '../types'
import { TorrentListItem } from './TorrentListItem'
import { AddTorrentButton } from './AddTorrentButton'

interface TorrentListProps {
  walletInfo: WalletInfo
}

export const TorrentList = ({ walletInfo }: TorrentListProps) => {
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
            new Date(parseInt(_document.updatedAt.toString()))
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {walletInfo.connected && <AddTorrentButton />}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-4 border-gray-200 dark:border-gray-700 animate-pulse-subtle" />
              <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-t-primary-500 animate-spin" />
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading torrents...</p>
          </div>
        )}

        {!loading && !error && torrents.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No torrents</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by adding a new torrent.</p>
            <div className="mt-6">
              <NavLink to="/add">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add your first torrent
                </button>
              </NavLink>
            </div>
          </div>
        )}

        {!loading && !error && torrents.length > 0 && (
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl">
            <div>
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Magnet
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Added
                    </th>
                    <th scope="col" className="relative px-6 py-4">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {torrents.map((_torrent) => (
                    <TorrentListItem key={_torrent.identifier} torrent={_torrent} walletInfo={walletInfo} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error loading torrents</h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
