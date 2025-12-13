import { useState, useEffect, type ChangeEvent } from 'react'
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

interface FormErrors {
  name: string | null
  description: string | null
  magnet: string | null
}

// Validation regex patterns (same as CreateTorrentModal)
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

export const UpdateTorrentModal = ({
  torrent,
  walletInfo,
  isOpen,
  onClose,
  onUpdate
}: UpdateTorrentModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState<UpdateForm>({
    name: '',
    description: '',
    magnet: ''
  })
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({
    name: null,
    description: null,
    magnet: null
  })

  // Sync form with torrent data when modal opens
  useEffect(() => {
    if (torrent && isOpen) {
      setForm({
        name: torrent.name || '',
        description: torrent.description || '',
        magnet: torrent.magnet || ''
      })
      setFieldErrors({ name: null, description: null, magnet: null })
    }
  }, [torrent, isOpen])

  const handleInputChange = (key: keyof UpdateForm, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [key]: e.target.value })
    if (fieldErrors[key]) {
      setFieldErrors({ ...fieldErrors, [key]: null })
    }
  }

  const handleBlur = (key: keyof UpdateForm) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateAllFields()) {
      return
    }

    setIsSubmitting(true)

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

      document.properties = {
        name: form.name,
        description: form.description,
        magnet: form.magnet
      }

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
    } finally {
      setIsSubmitting(false)
    }
  }

  const hasErrors = fieldErrors.name || fieldErrors.description || fieldErrors.magnet
  const isFormValid = form.name && form.description && form.magnet &&
    !fieldErrors.name && !fieldErrors.description && !fieldErrors.magnet

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Torrent"
      description={`Update the torrent information for ID: ${torrent?.identifier.substring(0, 8)}...`}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Errors summary at top - prevents layout shift */}
        {hasErrors && (
          <div className="p-3 rounded-lg bg-error/10 border border-error/20 space-y-1">
            {fieldErrors.name && <p className="text-sm text-error">{fieldErrors.name}</p>}
            {fieldErrors.description && <p className="text-sm text-error">{fieldErrors.description}</p>}
            {fieldErrors.magnet && <p className="text-sm text-error">{fieldErrors.magnet}</p>}
          </div>
        )}

        <div>
          <label htmlFor="update-name" className="block text-sm font-medium text-dash-dark dark:text-dash-white mb-2">
            Name <span className="text-error">*</span>
          </label>
          <Input
            id="update-name"
            variant="bordered"
            placeholder="Enter torrent name"
            value={form.name}
            onChange={(e) => handleInputChange('name', e)}
            onBlur={() => handleBlur('name')}
          />
        </div>

        <div>
          <label htmlFor="update-description" className="block text-sm font-medium text-dash-dark dark:text-dash-white mb-2">
            Description <span className="text-error">*</span>
          </label>
          <Textarea
            id="update-description"
            rows={3}
            variant="bordered"
            placeholder="Describe your torrent content"
            value={form.description}
            onChange={(e) => handleInputChange('description', e)}
            onBlur={() => handleBlur('description')}
          />
        </div>

        <div>
          <label htmlFor="update-magnet" className="block text-sm font-medium text-dash-dark dark:text-dash-white mb-2">
            Magnet Link <span className="text-error">*</span>
          </label>
          <Input
            id="update-magnet"
            variant="bordered"
            placeholder="magnet:?xt=urn:btih:...."
            className="font-mono"
            value={form.magnet}
            onChange={(e) => handleInputChange('magnet', e)}
            onBlur={() => handleBlur('magnet')}
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
            disabled={!isFormValid}
          >
            {isSubmitting ? 'Updating...' : 'Update Torrent'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
