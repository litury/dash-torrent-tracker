import {DashPlatformSDK} from 'dash-platform-sdk/bundle.min.js'
import { NETWORK } from '../constants.js'

let dashPlatformSDK

export const useSdk = () => {
  if (!dashPlatformSDK) {
    dashPlatformSDK = new DashPlatformSDK({network: NETWORK})
  }

  return dashPlatformSDK
}
