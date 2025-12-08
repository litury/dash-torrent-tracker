import { NavLink } from 'react-router-dom'
import ConnectWallet from './ConnectWallet.jsx'
import dashLogo from '/dash_logo.png'

export default function TorrentTrackerHeader ({ walletInfo, setWalletInfo }) {
  return (
    <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header className="flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img className="h-10" src={dashLogo} alt="Dash" />
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Dash Torrent Tracker</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Decentralized on testnet</p>
            </div>
          </NavLink>
          <ConnectWallet walletInfo={walletInfo} setWalletInfo={setWalletInfo} />
        </header>
      </div>
    </div>
  )
}
