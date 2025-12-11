import { useState, useRef, useEffect } from 'react'
import { Link, Pencil, Trash2, ExternalLink, MoreVertical } from 'lucide-react'
import type { Torrent } from '../types'
import type { WalletInfo } from '../../wallet/types'
import { UpdateTorrentModal } from '../parts/UpdateTorrentModal'
import { DeleteTorrentModal } from '../parts/DeleteTorrentModal'

interface TorrentRowProps {
  torrent: Torrent
  walletInfo: WalletInfo
}

const formatMagnetLink = (_magnet: string): string => {
  if (_magnet.length > 40) {
    return `${_magnet.substring(0, 40)}...`
  }
  return _magnet
}

const formatDate = (_timestamp: Date): string => {
  const date = new Date(_timestamp)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 1) {
    return 'Today'
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else {
    return date.toLocaleDateString()
  }
}

export const TorrentRow = ({ torrent, walletInfo }: TorrentRowProps) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleUpdate = () => {
    setShowDropdown(false)
    setShowUpdateModal(true)
  }

  const handleDelete = () => {
    setShowDropdown(false)
    setShowDeleteModal(true)
  }

  const handleUpdateTorrentAsync = async (_identifier: string) => {
    console.log('Updating torrent:', _identifier)
    await new Promise((_resolve) => setTimeout(_resolve, 1000))
    setShowUpdateModal(false)
    window.location.reload()
  }

  const handleDeleteTorrentAsync = async (_identifier: string) => {
    console.log('Deleting torrent:', _identifier)
    await new Promise((_resolve) => setTimeout(_resolve, 1000))
    setShowDeleteModal(false)
    window.location.reload()
  }

  const isOwner = walletInfo.connected && torrent.owner === walletInfo.currentIdentity

  return (
    <>
      <tr className="hover:bg-dash-dark-5 dark:hover:bg-dash-white-5 transition-colors">
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="flex flex-col">
            <div className="text-sm font-medium text-dash-dark dark:text-dash-white">
              {torrent.name}
            </div>
            <div className="text-xs text-dash-dark-75 dark:text-dash-white-75">
              ID: {torrent.identifier.substring(0, 8)}...
            </div>
          </div>
        </td>
        <td className="px-4 py-4">
          <div className="text-sm text-dash-dark-75 dark:text-dash-white-75 max-w-[200px] truncate">
            {torrent.description}
          </div>
        </td>
        <td className="px-4 py-4">
          <a
            href={torrent.magnet}
            className="inline-flex items-center text-sm text-dash-blue hover:text-dash-blue-75 transition-colors group"
            title={torrent.magnet}
          >
            <Link className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
            {formatMagnetLink(torrent.magnet)}
          </a>
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="flex flex-col">
            <div className="text-sm text-dash-dark dark:text-dash-white">
              {formatDate(torrent.timestamp)}
            </div>
            <div className="text-xs text-dash-dark-75 dark:text-dash-white-75">
              {new Date(torrent.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 text-dash-dark-75 hover:text-dash-dark dark:text-dash-white-75 dark:hover:text-dash-white hover:bg-dash-dark-5 dark:hover:bg-dash-white-15 rounded-lg transition-colors"
              title="Actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-1 w-44 bg-dash-white dark:bg-dash-space-cadet border border-dash-dark-15 dark:border-dash-white-15 rounded-lg shadow-lg z-10">
                <a
                  href={`https://testnet.platform-explorer.com/document/${torrent.identifier}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-dash-dark dark:text-dash-white hover:bg-dash-dark-5 dark:hover:bg-dash-white-15 transition-colors ${isOwner ? '' : 'rounded-lg'} rounded-t-lg`}
                  onClick={() => setShowDropdown(false)}
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Explorer
                </a>
                {isOwner && (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-dash-dark dark:text-dash-white hover:bg-dash-dark-5 dark:hover:bg-dash-white-15 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-error hover:bg-error-5 dark:hover:bg-error-15 transition-colors rounded-b-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </td>
      </tr>

      <UpdateTorrentModal
        torrent={torrent}
        walletInfo={walletInfo}
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onUpdate={handleUpdateTorrentAsync}
      />

      <DeleteTorrentModal
        torrent={torrent}
        walletInfo={walletInfo}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteTorrentAsync}
      />
    </>
  )
}
