import { NavLink } from 'react-router-dom'
import { Plus, LayoutGrid } from 'lucide-react'
import type { WalletInfo } from '../../modules/wallet/types'

interface SidebarProps {
  walletInfo: WalletInfo
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  { to: '/', icon: LayoutGrid, label: 'All torrents' }
]

export const Sidebar = ({ walletInfo, isOpen, onClose }: SidebarProps) => {
  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      <aside className="fixed left-0 top-0 h-full w-64 bg-dash-white dark:bg-dash-dark border-r border-dash-dark-15 dark:border-dash-white-15 flex flex-col z-50">
        <div className="p-6">
          {walletInfo.connected && (
            <NavLink
              to="/add"
              onClick={onClose}
              className="flex items-center justify-center gap-3 w-full px-6 py-3 bg-dash-blue hover:bg-dash-blue-75 text-dash-white font-medium rounded-xl transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Torrent
            </NavLink>
          )}
        </div>

        <nav className="flex-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-4 text-base font-medium transition-colors ${
                  isActive
                    ? 'text-dash-blue bg-dash-blue-5 dark:bg-dash-blue-15'
                    : 'text-dash-dark-75 dark:text-dash-white-75 hover:text-dash-dark dark:hover:text-dash-white hover:bg-dash-dark-5 dark:hover:bg-dash-white-15'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
