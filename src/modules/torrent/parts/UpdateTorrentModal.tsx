import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { clsx } from 'clsx'
import { X, RefreshCw } from 'lucide-react'
import { DATA_CONTRACT_IDENTIFIER, DOCUMENT_TYPE } from '../../../config/constants'
import { useSdk } from '../../../shared/hooks/useSdk'
import { Button } from '../../../shared/components/Button'
import type { Torrent } from '../types'
import type { WalletInfo } from '../../wallet/types'

interface UpdateTorrentModalProps {
  torrent: Torrent
  walletInfo: WalletInfo
  isOpen: boolean
  onClose: () => void
  onUpdate: (_identifier: string) => Promise<void>
}

interface UpdateForm {
  name: string
  description: string
  magnet: string
}

export const UpdateTorrentModal = ({
  torrent,
  walletInfo,
  isOpen,
  onClose,
  onUpdate
}: UpdateTorrentModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<UpdateForm>()

  useEffect(() => {
    if (torrent) {
      reset({
        name: torrent.name || '',
        description: torrent.description || '',
        magnet: torrent.magnet || ''
      })
    }
  }, [torrent, reset])

  const onSubmit = async (data: UpdateForm) => {
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

      document.properties = data

      const stateTransition = await sdk.documents.createStateTransition(
        document,
        'replace',
        { identityContractNonce: identityContractNonce + 1n }
      )

      await (window as any).dashPlatformExtension?.signer.signAndBroadcast(stateTransition)

      toast.success('Torrent updated successfully')
      await onUpdate(torrent.identifier)
      onClose()
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      toast.error(message)
      console.error('Error during submit:', e)
    }
  }

  if (!isOpen) return null

  const inputClassName = clsx(
    'w-full px-4 py-2 border rounded-lg transition-colors',
    'border-dash-dark-15 dark:border-dash-white-15',
    'focus:border-dash-blue focus:outline-none',
    'dark:bg-dash-space-cadet dark:text-dash-white'
  )

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-dash-white dark:bg-dash-space-cadet rounded-xl shadow-2xl">
            <div className="border-b border-dash-dark-15 dark:border-dash-white-15 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-dash-dark dark:text-dash-white">
                  Update Torrent
                </h3>
                <Button
                  variant="ghost"
                  color="darkBlue"
                  size="small"
                  iconOnly
                  icon={<X />}
                  onClick={onClose}
                />
              </div>
              <p className="mt-1 text-sm text-dash-dark-75 dark:text-dash-white-75">
                Update the torrent information for ID: {torrent?.identifier.substring(0, 8)}...
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div>
                <label htmlFor="update-name" className="block text-sm font-medium text-dash-dark dark:text-dash-white mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="update-name"
                  className={inputClassName}
                  placeholder="Enter torrent name"
                  {...register('name', { required: true })}
                />
              </div>

              <div>
                <label htmlFor="update-description" className="block text-sm font-medium text-dash-dark dark:text-dash-white mb-2">
                  Description
                </label>
                <textarea
                  id="update-description"
                  rows={3}
                  className={clsx(inputClassName, 'resize-none')}
                  placeholder="Describe your torrent content"
                  {...register('description', { required: true })}
                />
              </div>

              <div>
                <label htmlFor="update-magnet" className="block text-sm font-medium text-dash-dark dark:text-dash-white mb-2">
                  Magnet Link
                </label>
                <input
                  type="text"
                  id="update-magnet"
                  className={clsx(inputClassName, 'font-mono text-sm')}
                  placeholder="magnet:?xt=urn:btih:...."
                  {...register('magnet', { required: true })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <Button
                  type="button"
                  variant="alternative"
                  color="darkBlue"
                  size="small"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="small"
                  icon={<RefreshCw />}
                  loading={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Torrent'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
