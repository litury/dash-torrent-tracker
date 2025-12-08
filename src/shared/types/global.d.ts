declare global {
  interface Window {
    dashPlatformExtension?: {
      signer: {
        connect: () => Promise<{
          identities: string[]
          currentIdentity: string
        }>
        signAndBroadcast: (stateTransition: unknown) => Promise<void>
      }
    }
  }
}

export {}
