import { useState } from 'react'
import { ProfileChip } from './ProfileChip'
import type { WalletInfo } from '../types'
import { createWalletInfo } from '../types'

interface ConnectWalletProps {
  walletInfo: WalletInfo
  setWalletInfo: (_info: WalletInfo) => void
}

export const ConnectWallet = ({ walletInfo, setWalletInfo }: ConnectWalletProps) => {
  const [error, setError] = useState('')

  const handleConnectAsync = async () => {
    setError('')

    const extension = (window as any).dashPlatformExtension
    if (!extension) {
      return setError('Dash Platform Extension is not installed')
    }

    try {
      const { identities, currentIdentity } = await extension.signer.connect()
      setWalletInfo(createWalletInfo(true, identities, currentIdentity))
    } catch {
      setError('Connection failed')
    }
  }

  if (walletInfo.connected) {
    return <ProfileChip address={walletInfo.currentIdentity} />
  }

  return (
    <div className="flex flex-col items-end">
      <button
        onClick={handleConnectAsync}
        className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Connect Wallet
      </button>
      {error && <span className="mt-1 text-xs text-red-500">{error}</span>}
    </div>
  )
}
