import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, Sun, Moon } from 'lucide-react'
import { ConnectWallet } from '../../modules/wallet/components/ConnectWallet'
import { NETWORK } from '../../config/constants'
import type { WalletInfo } from '../../modules/wallet/types'
import dashLogo from '../../assets/dash_logo.svg'

interface HeaderProps {
  walletInfo: WalletInfo
  setWalletInfo: (_info: WalletInfo) => void
  onMenuClick: () => void
}

export const Header = ({ walletInfo, setWalletInfo, onMenuClick }: HeaderProps) => {
  const isTestnet = NETWORK === 'testnet'
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme')
      if (saved) {
        return saved === 'dark'
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  const toggleTheme = () => setIsDark(!isDark)

  return (
    <header className="bg-dash-white dark:bg-dash-dark border-b border-dash-dark-15 dark:border-dash-white-15">
      <div className="px-4 sm:px-6 lg:px-10 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="p-2 text-dash-dark-75 hover:text-dash-dark dark:text-dash-white-75 dark:hover:text-dash-white hover:bg-dash-dark-15 dark:hover:bg-dash-white-15 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <NavLink to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <img className="h-6" src={dashLogo} alt="Dash" />
              <h1 className="text-base font-bold text-dash-dark dark:text-dash-white uppercase tracking-widest">
                Dash Torrent Tracker
              </h1>
            </NavLink>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={toggleTheme}
              className="p-2 text-dash-dark-75 hover:text-dash-dark dark:text-dash-white-75 dark:hover:text-dash-white transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>

            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 text-xs font-medium rounded ${
                isTestnet
                  ? 'bg-warning-15 text-warning dark:bg-warning-15 dark:text-warning'
                  : 'bg-success-15 text-success dark:bg-success-15 dark:text-success'
              }`}>
                {isTestnet ? 'testnet' : 'mainnet'}
              </span>
              <ConnectWallet walletInfo={walletInfo} setWalletInfo={setWalletInfo} />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
