import { TorrentList } from '../modules/torrent/components/TorrentList'
import { TorrentPage } from '../modules/torrent/pages/TorrentPage'
import type { WalletInfo } from '../modules/wallet/types'

export interface OutletContext {
  walletInfo: WalletInfo
  setWalletInfo: (_info: WalletInfo) => void
  activeCategory: string
  searchQuery: string
  setPageTitle: (title: string | undefined) => void
  setTorrentCount: (count: number | undefined) => void
  ownerFilter: 'all' | 'mine'
  refreshKey: number
}

export const HomePage = () => {
  return <TorrentList />
}

export { TorrentPage }
