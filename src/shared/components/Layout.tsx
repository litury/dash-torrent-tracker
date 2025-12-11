import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { INITIAL_WALLET_INFO, type WalletInfo } from '../../modules/wallet'

export const Layout = () => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo>(INITIAL_WALLET_INFO)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-dash-dark-5 dark:bg-dash-dark">
      <Sidebar
        walletInfo={walletInfo}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <Header
        walletInfo={walletInfo}
        setWalletInfo={setWalletInfo}
        onMenuClick={() => setSidebarOpen(true)}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet context={{ walletInfo, setWalletInfo }} />
      </main>
    </div>
  )
}
