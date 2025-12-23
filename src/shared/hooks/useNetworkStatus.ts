import { useState, useEffect } from 'react'

export interface NetworkStatus {
  network: 'testnet' | 'mainnet' | null
  isLoading: boolean
  error: string | null
}

export const useNetworkStatus = (): NetworkStatus => {
  const [status, setStatus] = useState<NetworkStatus>({
    network: null,
    isLoading: true,
    error: null
  })

  useEffect(() => {
    let mounted = true
    let attemptCount = 0

    const detectNetwork = async () => {
      if (!mounted) return

      try {
        // Check if extension exists
        if (!window.dashPlatformExtension?.getNetworkName) {
          attemptCount++

          // After 5 attempts (15 seconds), stop loading state
          if (attemptCount > 5) {
            if (mounted) {
              setStatus({
                network: null,
                isLoading: false,
                error: 'Extension not available'
              })
            }
          }
          return
        }

        // Reset attempt count once extension is found
        attemptCount = 0

        // Call getNetworkName()
        const network = await window.dashPlatformExtension.getNetworkName()

        if (mounted) {
          setStatus({
            network,
            isLoading: false,
            error: null
          })
        }
      } catch (err) {
        if (mounted) {
          setStatus({
            network: null,
            isLoading: false,
            error: err instanceof Error ? err.message : 'Network detection failed'
          })
        }
      }
    }

    // Initial check
    detectNetwork()

    // Poll every 3 seconds to detect network changes
    const interval = setInterval(detectNetwork, 3000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  return status
}
