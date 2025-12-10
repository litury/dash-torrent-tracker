import { DashPlatformSDK } from 'dash-platform-sdk'
import { NETWORK } from '@/config/constants'

let dashPlatformSDK: DashPlatformSDK | null = null

export const useSdk = (): DashPlatformSDK => {
  if (!dashPlatformSDK) {
    dashPlatformSDK = new DashPlatformSDK({ network: NETWORK })
  }

  return dashPlatformSDK
}
