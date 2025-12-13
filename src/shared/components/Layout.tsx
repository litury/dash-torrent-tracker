import { useState, useEffect } from 'react'
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
  const [showMyTorrents, setShowMyTorrents] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('viewMode')
      return (saved as 'grid' | 'list') || 'grid'
    }
    return 'grid'
  })
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sortOrder')
      return (saved as 'desc' | 'asc') || 'desc'
    }
    return 'desc'
  })

  // Reset showMyTorrents when wallet disconnects
  useEffect(() => {
    if (!walletInfo.connected && showMyTorrents) {
      setShowMyTorrents(false)
    }
  }, [walletInfo.connected, showMyTorrents])

  // Save viewMode to localStorage when changed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('viewMode', viewMode)
    }
  }, [viewMode])

  // Save sortOrder to localStorage when changed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sortOrder', sortOrder)
    }
  }, [sortOrder])

  // Reset title when navigating away from home
  const isHomePage = location.pathname === '/'
  const isTorrentPage = location.pathname.startsWith('/torrent/')
  const displayTitle = isHomePage ? pageTitle : isTorrentPage ? 'Torrent Details' : undefined
  const displayCount = isHomePage ? torrentCount : undefined
  const showFilters = isHomePage

  return (
    <div className="h-screen flex flex-col bg-dash-dark-5 dark:bg-dash-dark">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        isWalletConnected={walletInfo.connected}
        onAddTorrent={() => setCreateModalOpen(true)}
      />
      <div className="lg:pl-64 flex flex-col h-full">
        <Header
          walletInfo={walletInfo}
          setWalletInfo={setWalletInfo}
          onMenuClick={() => setSidebarOpen(true)}
          title={displayTitle}
          count={displayCount}
          searchQuery={showFilters ? searchQuery : undefined}
          onSearchChange={showFilters ? setSearchQuery : undefined}
          showMyTorrents={showFilters ? showMyTorrents : undefined}
          onShowMyTorrentsChange={showFilters ? setShowMyTorrents : undefined}
          viewMode={showFilters ? viewMode : undefined}
          onViewModeChange={showFilters ? setViewMode : undefined}
          sortOrder={showFilters ? sortOrder : undefined}
          onSortOrderChange={showFilters ? setSortOrder : undefined}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet context={{ walletInfo, setWalletInfo, activeCategory, searchQuery, setPageTitle, setTorrentCount, showMyTorrents, refreshKey, viewMode, sortOrder }} />
          </div>
        </main>
        <Footer />
      </div>

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
