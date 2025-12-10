import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Outlet, useOutletContext } from 'react-router-dom'
import './index.css'

import { Header } from './shared/components/Header'
import { TorrentList, CreateTorrent } from './modules/torrent'
import { INITIAL_WALLET_INFO, type WalletInfo } from './modules/wallet'

interface OutletContext {
  walletInfo: WalletInfo
  setWalletInfo: (_info: WalletInfo) => void
}

const Layout = () => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo>(INITIAL_WALLET_INFO)

  return (
    <div className="min-h-screen">
      <Header walletInfo={walletInfo} setWalletInfo={setWalletInfo} />
      <Outlet context={{ walletInfo, setWalletInfo }} />
    </div>
  )
}

const HomePage = () => {
  const { walletInfo } = useOutletContext<OutletContext>()
  return <TorrentList walletInfo={walletInfo} />
}

const AddPage = () => {
  const { walletInfo } = useOutletContext<OutletContext>()
  return <CreateTorrent walletInfo={walletInfo} />
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="add" element={<AddPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

const rootElement = document.getElementById('root')

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}
