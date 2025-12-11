import { useEffect, useState } from 'react'
import { Menu, Sun, Moon } from 'lucide-react'
import { ConnectWallet } from '../../modules/wallet/components/ConnectWallet'
import type { WalletInfo } from '../../modules/wallet/types'

interface HeaderProps {
  walletInfo: WalletInfo
  setWalletInfo: (_info: WalletInfo) => void
  onMenuClick: () => void
}

export const Header = ({ walletInfo, setWalletInfo, onMenuClick }: HeaderProps) => {
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
      <div className="px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-dash-dark-75 hover:text-dash-dark dark:text-dash-white-75 dark:hover:text-dash-white hover:bg-dash-dark-15 dark:hover:bg-dash-white-15 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Right side */}
          <div className="flex items-center gap-4 sm:gap-6 ml-auto">
            <button
              onClick={toggleTheme}
              className="text-dash-dark-75 hover:text-dash-dark dark:text-dash-white-75 dark:hover:text-dash-white transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <ConnectWallet walletInfo={walletInfo} setWalletInfo={setWalletInfo} />
          </div>
        </div>
      </div>
    </header>
  )
}
