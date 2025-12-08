import { useState } from 'react'
import UpdateTorrentModal from './UpdateTorrentModal'
import DeleteTorrentModal from './DeleteTorrentModal'

export default function TorrentListItem ({ torrent, walletInfo }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const formatMagnetLink = (magnet) => {
    if (magnet.length > 40) {
      return `${magnet.substring(0, 40)}...`
    }
    return magnet
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffTime = Math.abs(now - date)
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

  const handleUpdate = () => {
    setShowDropdown(false)
    setShowUpdateModal(true)
  }

  const handleDelete = () => {
    setShowDropdown(false)
    setShowDeleteModal(true)
  }

  const handleUpdateTorrent = async (identifier, data) => {
    // TODO: Implement actual update logic with API
    console.log('Updating torrent:', identifier, data)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setShowUpdateModal(false)
    // Refresh the list after update
    window.location.reload()
  }

  const handleDeleteTorrent = async (identifier, data) => {
    // TODO: Implement actual delete logic with API
    console.log('Deleting torrent:', identifier, data)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setShowDeleteModal(false)
    // Refresh the list after delete
    window.location.reload()
  }

  return (
    <>
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex flex-col">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {torrent.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              ID: {torrent.identifier.substring(0, 8)}...
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-gray-600 dark:text-gray-300 max-w-3xs truncate">
            {torrent.description}
          </div>
        </td>
        <td className="px-6 py-4">
          <a
            href={torrent.magnet}
            className="inline-flex items-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors group"
            title={torrent.magnet}
          >
            <svg className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
            </svg>
            {formatMagnetLink(torrent.magnet)}
          </a>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex flex-col">
            <div className="text-sm text-gray-900 dark:text-white">
              {formatDate(torrent.timestamp)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(torrent.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end gap-2">
            <a
              href={`https://testnet.platform-explorer.com/document/${torrent.identifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="View on Explorer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>

            {/* Dropdown Menu */}

            {
              walletInfo.connected && torrent.owner === walletInfo.currentIdentity && <div>
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Actions"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                    </svg>
                  </button>

                  {showDropdown && (
                    <>
                      {/* Backdrop to close dropdown when clicking outside */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDropdown(false)}
                      />

                      {/* Dropdown Menu */}
                      <div
                        className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-20">
                        <div className="py-1">
                          <button
                            onClick={handleUpdate}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                            Update
                          </button>
                          <button
                            onClick={handleDelete}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

              </div>
            }
          </div>
        </td>
      </tr>

      {/* Modals */}
      <UpdateTorrentModal
        torrent={torrent}
        walletInfo={walletInfo}
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onUpdate={handleUpdateTorrent}
      />

      <DeleteTorrentModal
        torrent={torrent}
        walletInfo={walletInfo}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteTorrent}
      />
    </>
  )
}
