import { useState } from 'react'
import ProfileChip from './ProfileChip.jsx'
import { WalletInfo } from '../models/WalletInfo.js'

export default function ConnectWallet({ walletInfo, setWalletInfo }) {
  const [error, setError] = useState('')

  const handleConnect = async () => {
    setError('')

    if (!window.dashPlatformExtension) {
      return setError('Dash Platform Extension is not installed')
    }

    try {
      const { identities, currentIdentity } = await window.dashPlatformExtension.signer.connect()
      setWalletInfo(new WalletInfo(true, identities, currentIdentity))
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
        onClick={handleConnect}
        className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Connect Wallet
      </button>
      {error && <span className="mt-1 text-xs text-red-500">{error}</span>}
    </div>
  )
}
