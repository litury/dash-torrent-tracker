import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { Footer } from './Footer'
import { INITIAL_WALLET_INFO, type WalletInfo } from '../../modules/wallet'
import { CreateTorrentModal } from '../../modules/torrent/parts/CreateTorrentModal'

export const Layout = () => {
  const location = useLocation()
  const [walletInfo, setWalletInfo] = useState<WalletInfo>(INITIAL_WALLET_INFO)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [pageTitle, setPageTitle] = useState<string | undefined>()
  const [torrentCount, setTorrentCount] = useState<number | undefined>()
  const [ownerFilter, setOwnerFilter] = useState<'all' | 'mine'>('all')
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // Reset title when navigating away from home
  const isHomePage = location.pathname === '/'
  const displayTitle = isHomePage ? pageTitle : undefined
  const displayCount = isHomePage ? torrentCount : undefined

  return (
    <div className="min-h-screen bg-dash-dark-5 dark:bg-dash-dark">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isWalletConnected={walletInfo.connected}
        onAddTorrent={() => setCreateModalOpen(true)}
      />
      <div className="lg:pl-64 pb-16">
        <Header
          walletInfo={walletInfo}
          setWalletInfo={setWalletInfo}
          onMenuClick={() => setSidebarOpen(true)}
          title={displayTitle}
          count={displayCount}
          ownerFilter={ownerFilter}
          onOwnerFilterChange={setOwnerFilter}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet context={{ walletInfo, setWalletInfo, activeCategory, searchQuery, setPageTitle, setTorrentCount, ownerFilter, refreshKey }} />
        </main>
      </div>
      <Footer />

      <CreateTorrentModal
        walletInfo={walletInfo}
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={async () => {
          setRefreshKey((k) => k + 1)
        }}
      />
    </div>
  )
}
