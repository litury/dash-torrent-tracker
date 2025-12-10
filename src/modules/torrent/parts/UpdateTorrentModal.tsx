import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react'
import { DATA_CONTRACT_IDENTIFIER, DOCUMENT_TYPE } from '@/config/constants'
import { useSdk } from '@shared/hooks/useSdk'
import type { Torrent } from '../types'
import type { WalletInfo } from '@modules/wallet/types'

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
  const [form, setForm] = useState<UpdateForm>({
    name: '',
    description: '',
    magnet: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (torrent) {
      setForm({
        name: torrent.name || '',
        description: torrent.description || '',
        magnet: torrent.magnet || ''
      })
    }
  }, [torrent])

  const handleInputChange = (_key: keyof UpdateForm, _e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [_key]: _e.target.value })
  }

  const handleSubmitAsync = async (_e: FormEvent) => {
    _e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const sdk = useSdk()

      if (!walletInfo.currentIdentity) {
        throw new Error('Wallet not connected')
      }

      const identityContractNonce = await sdk.identities.getIdentityContractNonce(
        walletInfo.currentIdentity,
        DATA_CONTRACT_IDENTIFIER
      )

      const data = {
        name: form.name,
        description: form.description,
        magnet: form.magnet
      }

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

      await onUpdate(torrent.identifier)
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      console.error('Error during submit:', e)
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
          <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Update Torrent
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Update the torrent information for ID: {torrent?.identifier.substring(0, 8)}...
              </p>
            </div>

            <form onSubmit={handleSubmitAsync} className="p-6 space-y-6">
              {error && (
                <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error updating torrent</h3>
                      <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="update-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="update-name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  onChange={(_e) => handleInputChange('name', _e)}
                  value={form.name}
                  placeholder="Enter torrent name"
                  required
                />
              </div>

              <div>
                <label htmlFor="update-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  id="update-description"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors resize-none"
                  onChange={(_e) => handleInputChange('description', _e)}
                  value={form.description}
                  placeholder="Describe your torrent content"
                  required
                />
              </div>

              <div>
                <label htmlFor="update-magnet" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Magnet Link
                </label>
                <input
                  type="text"
                  id="update-magnet"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors font-mono text-sm"
                  onChange={(_e) => handleInputChange('magnet', _e)}
                  value={form.magnet}
                  placeholder="magnet:?xt=urn:btih:...."
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Update Torrent
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
