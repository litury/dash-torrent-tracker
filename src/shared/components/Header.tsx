import { useEffect, useState } from 'react'
import { Menu, Sun, Moon, Search, LayoutGrid, List, User, ArrowDown, ArrowUp } from 'lucide-react'
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
  viewMode?: 'grid' | 'list'
  onViewModeChange?: (_mode: 'grid' | 'list') => void
  sortOrder?: 'desc' | 'asc'
  onSortOrderChange?: (_order: 'desc' | 'asc') => void
}

export const Header = ({ walletInfo, setWalletInfo, onMenuClick, title, count, searchQuery, onSearchChange, showMyTorrents, onShowMyTorrentsChange, viewMode, onViewModeChange, sortOrder, onSortOrderChange }: HeaderProps) => {
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

  const hasFilters = onViewModeChange || onSearchChange

  // Filter controls - reused in both desktop and mobile
  const FilterControls = () => (
    <>
      {/* View mode toggle */}
      {onViewModeChange && (
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-dash-dark-5 dark:bg-dash-white-15">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'grid'
                ? 'bg-dash-white dark:bg-dash-dark text-dash-blue'
                : 'text-dash-dark-75 dark:text-dash-white-75 hover:text-dash-dark dark:hover:text-dash-white'
            }`}
            aria-label="Grid view"
            title="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'list'
                ? 'bg-dash-white dark:bg-dash-dark text-dash-blue'
                : 'text-dash-dark-75 dark:text-dash-white-75 hover:text-dash-dark dark:hover:text-dash-white'
            }`}
            aria-label="List view"
            title="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* My Torrents filter button */}
      {walletInfo.connected && onShowMyTorrentsChange !== undefined && (
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-dash-dark-5 dark:bg-dash-white-15">
          <button
            onClick={() => onShowMyTorrentsChange(!showMyTorrents)}
            className={`p-1.5 rounded transition-colors ${
              showMyTorrents
                ? 'bg-dash-white dark:bg-dash-dark text-dash-blue'
                : 'text-dash-dark-75 dark:text-dash-white-75 hover:text-dash-dark dark:hover:text-dash-white'
            }`}
            aria-label="Show my torrents"
            title="My torrents"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sort order toggle */}
      {onSortOrderChange && (
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-dash-dark-5 dark:bg-dash-white-15">
          <button
            onClick={() => onSortOrderChange(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="p-1.5 rounded transition-colors text-dash-dark-75 dark:text-dash-white-75 hover:text-dash-dark dark:hover:text-dash-white"
            aria-label={sortOrder === 'desc' ? 'Newest first' : 'Oldest first'}
            title={sortOrder === 'desc' ? 'Newest first' : 'Oldest first'}
          >
            {sortOrder === 'desc' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
          </button>
        </div>
      )}
    </>
  )

  // Search button/input - reused in both desktop and mobile
  const SearchControl = () => (
    <>
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
    </>
  )

  return (
    <header className="bg-dash-white dark:bg-dash-dark border-b border-dash-dark-15 dark:border-dash-white-15">
      {/* Row 1: Always visible - Menu + Title | Theme + Wallet */}
      <div className="px-4 sm:px-6 lg:px-8 h-12 flex items-center">
        <div className="flex items-center justify-between w-full">
          {/* Left side: Menu + Title */}
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
              <h1 className="text-xs font-bold text-dash-dark dark:text-dash-white uppercase tracking-widest flex items-center gap-1.5">
                {title}
                {count !== undefined ? (
                  <span className="text-xs font-bold text-dash-dark-75 dark:text-dash-white-75 tabular-nums inline-block min-w-[2.5rem] text-center">
                    ({count})
                  </span>
                ) : onShowMyTorrentsChange !== undefined ? (
                  <span className="h-4 min-w-[2.5rem] rounded bg-dash-dark-15 dark:bg-dash-white-15 animate-pulse inline-block" />
                ) : null}
              </h1>
            )}

            {/* Desktop only: Filters inline */}
            <div className="hidden sm:flex items-center gap-1 ml-2">
              <FilterControls />
            </div>
          </div>

          {/* Right side: Search (desktop) + Theme + Wallet */}
          <div className="flex items-center gap-1">
            {/* Desktop only: Search */}
            <div className="hidden sm:block">
              <SearchControl />
            </div>

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

      {/* Row 2: Mobile only - Filters + Search */}
      {hasFilters && (
        <div className="sm:hidden px-4 h-10 flex items-center justify-between border-t border-dash-dark-5 dark:border-dash-white-5">
          <div className="flex items-center gap-1">
            <FilterControls />
          </div>
          <SearchControl />
        </div>
      )}
    </header>
  )
}
