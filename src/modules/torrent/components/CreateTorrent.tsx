import { useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { DATA_CONTRACT_IDENTIFIER, DOCUMENT_TYPE } from '../../../config/constants'
import { useSdk } from '../../../shared/hooks/useSdk'
import type { WalletInfo } from '../../wallet/types'

// Validation regex patterns (can be copied to contract)
const NAME_REGEX = /^.{3,100}$/
const DESCRIPTION_REGEX = /^[\s\S]{16,1000}$/
const MAGNET_REGEX = /^magnet:\?xt=urn:btih:[a-zA-Z0-9]{32,40}/

// Validation functions
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

interface CreateTorrentProps {
  walletInfo: WalletInfo
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

export const CreateTorrent = ({ walletInfo }: CreateTorrentProps) => {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
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

  const handleInputChange = (_key: keyof TorrentForm, _e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [_key]: _e.target.value })
    // Clear error when user starts typing
    if (fieldErrors[_key]) {
      setFieldErrors({ ...fieldErrors, [_key]: null })
    }
  }

  const handleBlur = (_key: keyof TorrentForm) => {
    let error: string | null = null
    switch (_key) {
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
    setFieldErrors({ ...fieldErrors, [_key]: error })
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

  const handleSubmitAsync = async () => {
    if (!validateAllFields()) {
      return
    }

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

      navigate('/')
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      console.error('Error during submit:', e)
    }
  }

  const isFormValid = form.name && form.description && form.magnet &&
    !fieldErrors.name && !fieldErrors.description && !fieldErrors.magnet

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-dash-white dark:bg-dash-space-cadet shadow-xl rounded-xl p-6 sm:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-dash-dark dark:text-dash-white mb-2">
            Add New Torrent
          </h2>
          <p className="text-dash-dark-75 dark:text-dash-white-75">
            Share your torrent on the decentralized Dash Platform
          </p>
        </div>

        {!walletInfo.connected && (
          <div className="mb-8 rounded-lg border border-warning-15 bg-warning-5 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-warning" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-warning">
                  Connect Your Wallet
                </h3>
                <div className="mt-2 text-sm text-warning-75">
                  <p>
                    Dash Platform extension is not loaded. You must install the extension in order to make write actions.
                  </p>
                  <p className="mt-2">
                    <a href="#" className="font-medium underline hover:text-warning">
                      Learn how to install the extension →
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {walletInfo.connected && (
          <>
            {error && (
              <div className="mb-6 rounded-lg bg-error-5 dark:bg-error-15 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-error" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-error">Error during submit</h3>
                    <div className="mt-2 text-sm text-error-75">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6 flex items-center justify-between rounded-lg bg-success-5 dark:bg-success-15 px-4 py-3 border border-success-15">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-success">
                    Wallet connected
                  </p>
                  {walletInfo.currentIdentity && (
                    <p className="text-xs text-success-75 mt-0.5">
                      Active: {walletInfo.currentIdentity.substring(0, 8)}...{walletInfo.currentIdentity.substring(walletInfo.currentIdentity.length - 6)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {!error && (
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-dash-dark dark:text-dash-white mb-2">
                    Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    className={`w-full px-4 py-2 border rounded-lg focus:border-dash-blue focus:outline-none dark:bg-dash-space-cadet dark:text-dash-white transition-colors ${
                      fieldErrors.name ? 'border-error' : 'border-dash-dark-15 dark:border-dash-white-15'
                    }`}
                    onChange={(_e) => handleInputChange('name', _e)}
                    onBlur={() => handleBlur('name')}
                    value={form.name}
                    placeholder="Enter torrent name"
                    required
                  />
                  {fieldErrors.name && (
                    <p className="mt-1 text-sm text-error">{fieldErrors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-dash-dark dark:text-dash-white mb-2">
                    Description <span className="text-error">*</span>
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    className={`w-full px-4 py-2 border rounded-lg focus:border-dash-blue focus:outline-none dark:bg-dash-space-cadet dark:text-dash-white transition-colors resize-none ${
                      fieldErrors.description ? 'border-error' : 'border-dash-dark-15 dark:border-dash-white-15'
                    }`}
                    onChange={(_e) => handleInputChange('description', _e)}
                    onBlur={() => handleBlur('description')}
                    value={form.description}
                    placeholder="Describe your torrent content"
                    required
                  />
                  {fieldErrors.description && (
                    <p className="mt-1 text-sm text-error">{fieldErrors.description}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="magnet" className="block text-sm font-medium text-dash-dark dark:text-dash-white mb-2">
                    Magnet Link <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    id="magnet"
                    className={`w-full px-4 py-2 border rounded-lg focus:border-dash-blue focus:outline-none dark:bg-dash-space-cadet dark:text-dash-white transition-colors font-mono text-sm ${
                      fieldErrors.magnet ? 'border-error' : 'border-dash-dark-15 dark:border-dash-white-15'
                    }`}
                    onChange={(_e) => handleInputChange('magnet', _e)}
                    onBlur={() => handleBlur('magnet')}
                    value={form.magnet}
                    placeholder="magnet:?xt=urn:btih:...."
                    required
                  />
                  {fieldErrors.magnet && (
                    <p className="mt-1 text-sm text-error">{fieldErrors.magnet}</p>
                  )}
                </div>
              </form>
            )}

            <div className="pt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSubmitAsync}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-dash-white bg-dash-blue hover:bg-dash-blue-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dash-blue transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-dash-blue"
                disabled={!isFormValid}
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Torrent
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
