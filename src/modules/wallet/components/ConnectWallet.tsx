import { useState, useRef, useEffect } from 'react'
import { LogOut } from 'lucide-react'
import { ProfileChip } from '../parts/ProfileChip'
import { Button } from '../../../shared/components/Button'
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
      <div className="relative" ref={dropdownRef}>
        <ProfileChip
          address={walletInfo.currentIdentity}
          onClick={() => setShowDropdown(!showDropdown)}
        />

        {showDropdown && (
          <div className="absolute right-0 mt-2 z-10">
            <Button
              color="error"
              size="small"
              icon={<LogOut />}
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-end">
      <Button onClick={handleConnectAsync} size="small" className="min-w-[130px]">
        Connect Wallet
      </Button>
      {error && <span className="mt-1 text-xs text-error">{error}</span>}
    </div>
  )
}
