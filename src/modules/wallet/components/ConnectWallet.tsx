import { useState, useRef, useEffect } from 'react'
import { LogOut } from 'lucide-react'
import { ProfileChip } from '../parts/ProfileChip'
import type { WalletInfo } from '../types'
import { createWalletInfo, INITIAL_WALLET_INFO } from '../types'

interface ConnectWalletProps {
  walletInfo: WalletInfo
  setWalletInfo: (_info: WalletInfo) => void
}

export const ConnectWallet = ({ walletInfo, setWalletInfo }: ConnectWalletProps) => {
  const [error, setError] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  const handleDisconnect = () => {
    setWalletInfo(INITIAL_WALLET_INFO)
    setShowDropdown(false)
  }

  if (walletInfo.connected) {
    return (
      <div className="relative min-w-[140px]" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="focus:outline-none w-full"
        >
          <ProfileChip address={walletInfo.currentIdentity} />
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-40 bg-dash-white dark:bg-dash-space-cadet border border-dash-dark-15 dark:border-dash-white-15 rounded-lg shadow-lg z-10">
            <button
              onClick={handleDisconnect}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-error hover:bg-error-5 dark:hover:bg-error-15 transition-colors rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-end min-w-[140px]">
      <button
        onClick={handleConnectAsync}
        className="w-full px-4 py-2 text-sm font-medium rounded-lg text-dash-white bg-dash-blue hover:bg-dash-blue-75 transition-colors"
      >
        Connect Wallet
      </button>
      {error && <span className="mt-1 text-xs text-error">{error}</span>}
    </div>
  )
}
