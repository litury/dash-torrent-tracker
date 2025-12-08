import {DashPlatformSDK} from 'dash-platform-sdk/bundle.min.js'

let dashPlatformSDK

export const useSdk = () => {

  if (window.dashPlatformSDK) {
    return window.dashPlatformSDK
  }

  if (!dashPlatformSDK) {
    dashPlatformSDK = new DashPlatformSDK()
  }

  return dashPlatformSDK
}
