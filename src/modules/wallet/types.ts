export interface WalletInfo {
  connected: boolean
  identities: string[] | null
  currentIdentity: string | null
}

export const createWalletInfo = (
  _connected = false,
  _identities: string[] | null = null,
  _currentIdentity: string | null = null
): WalletInfo => ({
  connected: _connected,
  identities: _identities,
  currentIdentity: _currentIdentity
})

export const INITIAL_WALLET_INFO: WalletInfo = {
  connected: false,
  identities: null,
  currentIdentity: null
}
