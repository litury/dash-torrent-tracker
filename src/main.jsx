import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Outlet, useOutletContext } from 'react-router-dom'
import './index.css'

import TorrentTrackerHeader from './components/TorrentTrackerHeader.jsx'
import TorrentList from './components/TorrentList.jsx'
import CreateTorrent from './components/CreateTorrent.jsx'
import { WalletInfo } from './models/WalletInfo.js'

const basename = import.meta.env.PROD ? '/dash-torrent-tracker' : ''

function Layout() {
  const [walletInfo, setWalletInfo] = useState(new WalletInfo(false, null, null))

  return (
    <div className="min-h-screen">
      <TorrentTrackerHeader walletInfo={walletInfo} setWalletInfo={setWalletInfo} />
      <Outlet context={{ walletInfo, setWalletInfo }} />
    </div>
  )
}

function HomePage() {
  const { walletInfo } = useOutletContext()
  return <TorrentList walletInfo={walletInfo} />
}

function AddPage() {
  const { walletInfo } = useOutletContext()
  return <CreateTorrent walletInfo={walletInfo} />
}

function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="add" element={<AddPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
