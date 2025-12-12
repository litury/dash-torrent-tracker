import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Plus, LayoutGrid, TrendingUp, Video, Music, Package, BookOpen, MoreHorizontal } from 'lucide-react'
import { Button } from './Button'
import dashLogo from '../../assets/dash_logo.svg'

const CATEGORIES = [
  { id: 'all', label: 'All Torrents', icon: LayoutGrid, disabled: false },
  { id: 'popular', label: 'Popular', icon: TrendingUp, disabled: true },
  { id: 'video', label: 'Video', icon: Video, disabled: true },
  { id: 'music', label: 'Music', icon: Music, disabled: true },
  { id: 'apps', label: 'Apps', icon: Package, disabled: true },
  { id: 'books', label: 'Books', icon: BookOpen, disabled: true },
  { id: 'other', label: 'Other', icon: MoreHorizontal, disabled: true }
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  activeCategory: string
  onCategoryChange: (_id: string) => void
  isWalletConnected: boolean
  onAddTorrent: () => void
}

export const Sidebar = ({
  isOpen,
  onClose,
  activeCategory,
  onCategoryChange,
  isWalletConnected,
  onAddTorrent
}: SidebarProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleCategoryClick = (id: string) => {
    onCategoryChange(id)
    if (location.pathname !== '/') {
      navigate('/')
    }
    onClose()
  }

  const sidebarContent = (
    <aside className="fixed left-0 top-0 h-full w-64 bg-dash-white dark:bg-dash-dark border-r border-dash-dark-15 dark:border-dash-white-15 flex flex-col z-50">
      {/* Logo */}
      <NavLink
        to="/"
        onClick={onClose}
        className="flex items-center gap-3 px-4 h-12 border-b border-dash-dark-15 dark:border-dash-white-15 hover:opacity-90 transition-opacity"
      >
        <img className="h-5" src={dashLogo} alt="Dash" />
        <span className="text-xs font-bold text-dash-dark dark:text-dash-white uppercase tracking-widest">
          Torrent Tracker
        </span>
      </NavLink>

      {/* Categories */}
      <nav className="flex-1 overflow-y-auto">
        <div className="px-6 py-2 text-xs font-medium text-dash-dark-75 dark:text-dash-white-75 uppercase tracking-wider">
          Categories
        </div>
        {CATEGORIES.map(({ id, label, icon: Icon, disabled }) => (
          <button
            key={id}
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                handleCategoryClick(id)
              }
            }}
            className={`flex items-center gap-3 w-full px-6 py-3 text-sm font-medium transition-colors ${
              disabled
                ? 'text-dash-dark-75/50 dark:text-dash-white-75/50 cursor-not-allowed border-l-2 border-transparent'
                : activeCategory === id
                  ? 'text-dash-blue bg-dash-blue-5 dark:bg-dash-blue-15 border-l-2 border-dash-blue'
                  : 'text-dash-dark-75 dark:text-dash-white-75 hover:text-dash-dark dark:hover:text-dash-white hover:bg-dash-dark-5 dark:hover:bg-dash-white-15 border-l-2 border-transparent'
            }`}
            title={disabled ? 'Coming soon' : undefined}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </nav>

      {/* New Torrent button */}
      <div className="px-3 h-12 flex items-center border-t border-dash-dark-15 dark:border-dash-white-15 w-full">
        <Button
          size="small"
          icon={<Plus />}
          className="w-full"
          disabled={!isWalletConnected}
          title={!isWalletConnected ? 'Connect wallet to add torrents' : undefined}
          onClick={() => {
            onAddTorrent()
            onClose()
          }}
        >
          New Torrent
        </Button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop: always visible */}
      <div className="hidden lg:block">
        {sidebarContent}
      </div>

      {/* Mobile: overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
          <div className="lg:hidden">
            {sidebarContent}
          </div>
        </>
      )}
    </>
  )
}
