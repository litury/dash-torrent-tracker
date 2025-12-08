export class WalletInfo {
  connected
  identities
  currentIdentity

  constructor (connected, identities, currentIdentity) {
    this.connected = connected ?? false
    this.identities = identities ?? null
    this.currentIdentity = currentIdentity ?? null
  }
}
