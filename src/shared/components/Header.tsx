import { NavLink } from 'react-router-dom'
import { ConnectWallet } from '../../modules/wallet/components/ConnectWallet'
import { NETWORK } from '../../config/constants'
import type { WalletInfo } from '../../modules/wallet/types'
import dashLogo from '../../assets/dash_logo.png'

interface HeaderProps {
  walletInfo: WalletInfo
  setWalletInfo: (_info: WalletInfo) => void
}

export const Header = ({ walletInfo, setWalletInfo }: HeaderProps) => {
  const isTestnet = NETWORK === 'testnet'

  return (
    <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header className="flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img className="h-10" src={dashLogo} alt="Dash" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Dash Torrent Tracker</h1>
                <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${
                  isTestnet
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {isTestnet ? 'testnet' : 'mainnet'}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Decentralized torrent tracker</p>
            </div>
          </NavLink>
          <ConnectWallet walletInfo={walletInfo} setWalletInfo={setWalletInfo} />
        </header>
      </div>
    </div>
  )
}
