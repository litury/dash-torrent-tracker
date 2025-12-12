import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { RefreshCw } from 'lucide-react'
import { DATA_CONTRACT_IDENTIFIER, DOCUMENT_TYPE } from '../../../config/constants'
import { useSdk } from '../../../shared/hooks/useSdk'
import { Modal } from '../../../shared/components/Modal'
import { Button } from '../../../shared/components/Button'
import { Input } from '../../../shared/components/Input'
import { Textarea } from '../../../shared/components/Textarea'
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Torrent"
      description={`Update the torrent information for ID: ${torrent?.identifier.substring(0, 8)}...`}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="update-name" className="block text-sm font-medium text-dash-dark dark:text-dash-white mb-2">
            Name
          </label>
          <Input
            id="update-name"
            variant="bordered"
            placeholder="Enter torrent name"
            {...register('name', { required: true })}
          />
        </div>

        <div>
          <label htmlFor="update-description" className="block text-sm font-medium text-dash-dark dark:text-dash-white mb-2">
            Description
          </label>
          <Textarea
            id="update-description"
            rows={3}
            variant="bordered"
            placeholder="Describe your torrent content"
            {...register('description', { required: true })}
          />
        </div>

        <div>
          <label htmlFor="update-magnet" className="block text-sm font-medium text-dash-dark dark:text-dash-white mb-2">
            Magnet Link
          </label>
          <Input
            id="update-magnet"
            variant="bordered"
            placeholder="magnet:?xt=urn:btih:...."
            className="font-mono"
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
    </Modal>
  )
}
