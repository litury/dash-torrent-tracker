import { useEffect, useState } from 'react'
import { Menu, Sun, Moon, Search } from 'lucide-react'
import { ConnectWallet } from '../../modules/wallet/components/ConnectWallet'
import { Button } from './Button'
import { SearchInput } from './SearchInput'
import type { WalletInfo } from '../../modules/wallet/types'

interface HeaderProps {
  walletInfo: WalletInfo
  setWalletInfo: (_info: WalletInfo) => void
  onMenuClick: () => void
  title?: string
  count?: number
  searchQuery?: string
  onSearchChange?: (_query: string) => void
  showMyTorrents?: boolean
  onShowMyTorrentsChange?: (_show: boolean) => void
}

export const Header = ({ walletInfo, setWalletInfo, onMenuClick, title, count, searchQuery, onSearchChange, showMyTorrents, onShowMyTorrentsChange }: HeaderProps) => {
  const [searchExpanded, setSearchExpanded] = useState(false)
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
    <header className="sticky top-0 z-10 bg-dash-white dark:bg-dash-dark border-b border-dash-dark-15 dark:border-dash-white-15">
      <div className="px-4 sm:px-6 lg:px-8 h-12 flex items-center">
        <div className="flex items-center justify-between w-full">
          {/* Left side: Menu + Title + Checkbox */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              color="darkBlue"
              size="small"
              iconOnly
              icon={<Menu />}
              onClick={onMenuClick}
              className="lg:hidden"
              aria-label="Open menu"
            />

            {title && (
              <h1 className="text-lg font-semibold text-dash-dark dark:text-dash-white flex items-center gap-1.5">
                {title}
                {count !== undefined ? (
                  <span className="text-sm font-normal text-dash-dark-75 dark:text-dash-white-75 tabular-nums inline-block min-w-[2.5rem] text-center">
                    ({count})
                  </span>
                ) : onShowMyTorrentsChange !== undefined ? (
                  <span className="h-5 min-w-[2.5rem] rounded bg-dash-dark-15 dark:bg-dash-white-15 animate-pulse inline-block" />
                ) : null}
              </h1>
            )}

            {/* My Torrents checkbox filter */}
            {walletInfo.connected && onShowMyTorrentsChange !== undefined && (
              <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dash-dark-5 dark:bg-dash-white-15 hover:bg-dash-dark-15 dark:hover:bg-dash-white-25 transition-colors cursor-pointer text-sm text-dash-dark dark:text-dash-white">
                <input
                  type="checkbox"
                  checked={showMyTorrents}
                  onChange={(e) => onShowMyTorrentsChange(e.target.checked)}
                />
                <span>My</span>
              </label>
            )}
          </div>

          {/* Right side: Search + Theme + Wallet */}
          <div className="flex items-center gap-1">
            {/* Search - expandable (expands to the left) */}
            {onSearchChange && (
              searchExpanded ? (
                <SearchInput
                  value={searchQuery || ''}
                  onChange={onSearchChange}
                  placeholder="Search torrents..."
                  onClose={() => setSearchExpanded(false)}
                />
              ) : (
                <button
                  onClick={() => setSearchExpanded(true)}
                  className="p-1.5 rounded-lg bg-dash-dark-5 dark:bg-dash-white-15 hover:bg-dash-dark-15 dark:hover:bg-dash-white-25 transition-colors text-dash-dark dark:text-dash-white"
                  aria-label="Search torrents"
                  title="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              )
            )}
            <Button
              variant="ghost"
              color="darkBlue"
              size="small"
              iconOnly
              icon={isDark ? <Sun /> : <Moon />}
              onClick={toggleTheme}
              aria-label="Toggle theme"
            />

            <ConnectWallet walletInfo={walletInfo} setWalletInfo={setWalletInfo} />
          </div>
        </div>
      </div>
    </header>
  )
}
