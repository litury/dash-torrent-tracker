import { useState } from 'react'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import { useSdk } from '../../../shared/hooks/useSdk'
import { Button } from '../../../shared/components/Button'
import { DATA_CONTRACT_IDENTIFIER, DOCUMENT_TYPE } from '../../../config/constants'
import type { Torrent } from '../types'
import type { WalletInfo } from '../../wallet/types'

interface DeleteTorrentModalProps {
  torrent: Torrent
  walletInfo: WalletInfo
  isOpen: boolean
  onClose: () => void
  onDelete: (_identifier: string) => void
}

export const DeleteTorrentModal = ({
  torrent,
  walletInfo,
  isOpen,
  onClose,
  onDelete
}: DeleteTorrentModalProps) => {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)

    try {
      const sdk = useSdk()

      if (!walletInfo.currentIdentity) {
        throw new Error('Wallet not connected')
      }

      const identityContractNonce = await sdk.identities.getIdentityContractNonce(
        walletInfo.currentIdentity,
        DATA_CONTRACT_IDENTIFIER
      )

      const where = [['$id', '==', torrent.identifier]]
      const [document] = await sdk.documents.query(DATA_CONTRACT_IDENTIFIER, DOCUMENT_TYPE, where)

      if (!document) {
        throw new Error(`Could not fetch torrent with identifier ${torrent.identifier}`)
      }

      const stateTransition = await sdk.documents.createStateTransition(
        document,
        'delete',
        { identityContractNonce: identityContractNonce + 1n }
      )

      await (window as any).dashPlatformExtension?.signer.signAndBroadcast(stateTransition)

      toast.success('Torrent deleted successfully')
      onDelete(torrent.identifier)
      onClose()
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-dash-white dark:bg-dash-space-cadet rounded-xl shadow-2xl">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error-15">
                  <Trash2 className="h-5 w-5 text-error" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-dash-dark dark:text-dash-white">
                    Delete Torrent
                  </h3>
                  <p className="text-sm text-dash-dark-75 dark:text-dash-white-75">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <div className="bg-dash-dark-5 dark:bg-dash-white-5 rounded-lg p-3">
                <p className="text-sm font-medium text-dash-dark dark:text-dash-white truncate">
                  {torrent.name}
                </p>
                <p className="text-xs text-dash-dark-75 dark:text-dash-white-75">
                  ID: {torrent.identifier.substring(0, 8)}...
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="alternative"
                  color="darkBlue"
                  size="small"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  color="error"
                  size="small"
                  onClick={handleDelete}
                  loading={loading}
                  className="flex-1"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
