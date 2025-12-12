import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { clsx } from 'clsx'
import { useSdk } from '../../../shared/hooks/useSdk'
import { DATA_CONTRACT_IDENTIFIER, DOCUMENT_TYPE } from '../../../config/constants'
import type { Torrent } from '../types'
import type { WalletInfo } from '../../wallet/types'

interface DeleteTorrentModalProps {
  torrent: Torrent
  walletInfo: WalletInfo
  isOpen: boolean
  onClose: () => void
  onDelete: (_identifier: string) => Promise<void>
}

interface DeleteForm {
  confirmText: string
}

export const DeleteTorrentModal = ({
  torrent,
  walletInfo,
  isOpen,
  onClose,
  onDelete
}: DeleteTorrentModalProps) => {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    reset
  } = useForm<DeleteForm>({
    defaultValues: { confirmText: '' }
  })

  const confirmText = watch('confirmText')
  const isConfirmed = confirmText === 'DELETE'

  const onSubmit = async () => {
    if (!isConfirmed) {
      toast.error('Please type DELETE to confirm')
      return
    }

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
      reset()
      await onDelete(torrent.identifier)
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
          <div className="relative w-full max-w-md bg-dash-white dark:bg-dash-space-cadet rounded-xl shadow-2xl">
            <div className="border-b border-dash-dark-15 dark:border-dash-white-15 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error-15">
                    <svg className="h-6 w-6 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-dash-dark dark:text-dash-white">
                    Delete Torrent
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="text-dash-dark-75 hover:text-dash-dark dark:text-dash-white-75 dark:hover:text-dash-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="bg-dash-dark-5 dark:bg-dash-white-5 rounded-lg p-4">
                  <p className="text-sm text-dash-dark-75 dark:text-dash-white-75 mb-2">
                    You are about to delete the following torrent:
                  </p>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-dash-dark dark:text-dash-white">{torrent?.name}</p>
                    <p className="text-xs text-dash-dark-75 dark:text-dash-white-75">ID: {torrent?.identifier}</p>
                  </div>
                </div>

                <div className="bg-warning-5 dark:bg-warning-15 border border-warning-15 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-warning" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-warning dark:text-warning-75">
                        This action cannot be undone. This will permanently delete the torrent from the Dash Platform.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm-delete" className="block text-sm font-medium text-dash-dark dark:text-dash-white mb-2">
                    Type <span className="font-bold">DELETE</span> to confirm
                  </label>
                  <input
                    type="text"
                    id="confirm-delete"
                    className={clsx(
                      'w-full px-4 py-2 border rounded-lg transition-colors',
                      'border-dash-dark-15 dark:border-dash-white-15',
                      'focus:border-error focus:outline-none',
                      'dark:bg-dash-space-cadet dark:text-dash-white'
                    )}
                    placeholder="Type DELETE"
                    {...register('confirmText')}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-dash-dark dark:text-dash-white bg-dash-white dark:bg-dash-space-cadet border border-dash-dark-15 dark:border-dash-white-15 rounded-lg hover:bg-dash-dark-5 dark:hover:bg-dash-white-15 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={clsx(
                    'px-4 py-2 text-sm font-medium text-dash-white bg-error rounded-lg',
                    'hover:bg-error-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error',
                    'transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center'
                  )}
                  disabled={loading || !isConfirmed}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-dash-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete Torrent
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
