import { useOutletContext } from 'react-router-dom'
import { TorrentTable } from '../modules/torrent/components/TorrentTable'
import { CreateTorrent } from '../modules/torrent/components/CreateTorrent'
import type { WalletInfo } from '../modules/wallet/types'

export interface OutletContext {
  walletInfo: WalletInfo
  setWalletInfo: (_info: WalletInfo) => void
}

export const HomePage = () => {
  const { walletInfo } = useOutletContext<OutletContext>()
  return <TorrentTable walletInfo={walletInfo} />
}

export const AddTorrentPage = () => {
  const { walletInfo } = useOutletContext<OutletContext>()
  return <CreateTorrent walletInfo={walletInfo} />
}

export const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/add', element: <AddTorrentPage /> }
]
