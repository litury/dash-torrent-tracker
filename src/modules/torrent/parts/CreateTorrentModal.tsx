import { useState, type ChangeEvent } from 'react'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { DATA_CONTRACT_IDENTIFIER, DOCUMENT_TYPE } from '../../../config/constants'
import { useSdk } from '../../../shared/hooks/useSdk'
import { Modal } from '../../../shared/components/Modal'
import { Button } from '../../../shared/components/Button'
import { Input } from '../../../shared/components/Input'
import { Textarea } from '../../../shared/components/Textarea'
import type { WalletInfo } from '../../wallet/types'

interface CreateTorrentModalProps {
  walletInfo: WalletInfo
  isOpen: boolean
  onClose: () => void
  onCreate: () => Promise<void>
}

interface TorrentForm {
  name: string
  description: string
  magnet: string
}

interface FormErrors {
  name: string | null
  description: string | null
  magnet: string | null
}

// Validation regex patterns
const NAME_REGEX = /^.{3,100}$/
const DESCRIPTION_REGEX = /^[\s\S]{16,1000}$/
const MAGNET_REGEX = /^magnet:\?xt=urn:btih:[a-zA-Z0-9]{32,40}/

const validateName = (value: string): string | null => {
  if (!NAME_REGEX.test(value.trim())) {
    return 'Name must be 3-100 characters'
  }
  return null
}

const validateDescription = (value: string): string | null => {
  if (!DESCRIPTION_REGEX.test(value.trim())) {
    return 'Description must be 16-1000 characters'
  }
  return null
}

const validateMagnet = (value: string): string | null => {
  if (!MAGNET_REGEX.test(value)) {
    return 'Invalid magnet link format (must start with magnet:?xt=urn:btih:)'
  }
  return null
}

export const CreateTorrentModal = ({
  walletInfo,
  isOpen,
  onClose,
  onCreate
}: CreateTorrentModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState<TorrentForm>({
    name: '',
    description: '',
    magnet: ''
  })
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({
    name: null,
    description: null,
    magnet: null
  })

  const handleInputChange = (key: keyof TorrentForm, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [key]: e.target.value })
    if (fieldErrors[key]) {
      setFieldErrors({ ...fieldErrors, [key]: null })
    }
  }

  const handleBlur = (key: keyof TorrentForm) => {
    let error: string | null = null
    switch (key) {
      case 'name':
        error = validateName(form.name)
        break
      case 'description':
        error = validateDescription(form.description)
        break
      case 'magnet':
        error = validateMagnet(form.magnet)
        break
    }
    setFieldErrors({ ...fieldErrors, [key]: error })
  }

  const validateAllFields = (): boolean => {
    const errors: FormErrors = {
      name: validateName(form.name),
      description: validateDescription(form.description),
      magnet: validateMagnet(form.magnet)
    }
    setFieldErrors(errors)
    return !errors.name && !errors.description && !errors.magnet
  }

  const resetForm = () => {
    setForm({ name: '', description: '', magnet: '' })
    setFieldErrors({ name: null, description: null, magnet: null })
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateAllFields()) {
      return
    }

    setIsSubmitting(true)

    try {
      const sdk = useSdk()
      const dashPlatformExtension = (window as any).dashPlatformExtension

      if (!dashPlatformExtension || !walletInfo.currentIdentity) {
        throw new Error('Wallet not connected')
      }

      let identityContractNonce: bigint

      try {
        identityContractNonce = await sdk.identities.getIdentityContractNonce(
          walletInfo.currentIdentity,
          DATA_CONTRACT_IDENTIFIER
        )
      } catch (e) {
        if (String(e).startsWith('Error: Could not get identityContractNonce')) {
          identityContractNonce = 0n
        } else {
          throw e
        }
      }

      const data = {
        name: form.name,
        description: form.description,
        magnet: form.magnet
      }

      const document = await sdk.documents.create(
        DATA_CONTRACT_IDENTIFIER,
        DOCUMENT_TYPE,
        data,
        walletInfo.currentIdentity,
        identityContractNonce + 1n
      )

      const stateTransition = await sdk.documents.createStateTransition(document, 'create', {
        identityContractNonce: identityContractNonce + 1n
      })

      await dashPlatformExtension.signer.signAndBroadcast(stateTransition)

      toast.success('Torrent created successfully')
      resetForm()
      await onCreate()
      onClose()
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      toast.error(message)
      console.error('Error during submit:', e)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = form.name && form.description && form.magnet &&
    !fieldErrors.name && !fieldErrors.description && !fieldErrors.magnet

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Torrent"
      description="Share your torrent on the decentralized Dash Platform"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="create-name" className="block text-sm font-medium text-dash-dark dark:text-dash-white mb-2">
            Name <span className="text-error">*</span>
          </label>
          <Input
            id="create-name"
            variant="bordered"
            placeholder="Enter torrent name"
            value={form.name}
            onChange={(e) => handleInputChange('name', e)}
            onBlur={() => handleBlur('name')}
            error={fieldErrors.name || undefined}
          />
        </div>

        <div>
          <label htmlFor="create-description" className="block text-sm font-medium text-dash-dark dark:text-dash-white mb-2">
            Description <span className="text-error">*</span>
          </label>
          <Textarea
            id="create-description"
            rows={3}
            variant="bordered"
            placeholder="Describe your torrent content"
            value={form.description}
            onChange={(e) => handleInputChange('description', e)}
            onBlur={() => handleBlur('description')}
            error={fieldErrors.description || undefined}
          />
        </div>

        <div>
          <label htmlFor="create-magnet" className="block text-sm font-medium text-dash-dark dark:text-dash-white mb-2">
            Magnet Link <span className="text-error">*</span>
          </label>
          <Input
            id="create-magnet"
            variant="bordered"
            placeholder="magnet:?xt=urn:btih:...."
            className="font-mono"
            value={form.magnet}
            onChange={(e) => handleInputChange('magnet', e)}
            onBlur={() => handleBlur('magnet')}
            error={fieldErrors.magnet || undefined}
          />
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <Button
            type="button"
            variant="alternative"
            color="darkBlue"
            size="small"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="small"
            icon={<Plus />}
            loading={isSubmitting}
            disabled={!isFormValid}
          >
            {isSubmitting ? 'Creating...' : 'Create Torrent'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
