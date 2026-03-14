"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    FB: typeof FB
    fbAsyncInit: () => void
  }
}

declare const FB: {
  init: (params: {
    appId: string
    cookie: boolean
    xfbml: boolean
    version: string
  }) => void
  AppEvents: { logPageView: () => void }
  getLoginStatus: (callback: (response: FacebookStatusResponse) => void) => void
  login: (
    callback: (response: FacebookStatusResponse) => void,
    options?: { scope: string }
  ) => void
  logout: (callback: () => void) => void
}

export interface FacebookAuthResponse {
  accessToken: string
  expiresIn: string
  signedRequest: string
  userID: string
}

export interface FacebookStatusResponse {
  status: "connected" | "not_authorized" | "unknown"
  authResponse: FacebookAuthResponse | null
}

export function FacebookSDKProvider() {
  useEffect(() => {
    const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID
    if (!appId) return

    window.fbAsyncInit = function () {
      window.FB.init({
        appId,
        cookie: true,
        xfbml: true,
        version: "v19.0",
      })
      window.FB.AppEvents.logPageView()
    }

    // Inject the SDK script only once
    if (!document.getElementById("facebook-jssdk")) {
      const js = document.createElement("script")
      js.id = "facebook-jssdk"
      js.src = "https://connect.facebook.net/en_US/sdk.js"
      const fjs = document.getElementsByTagName("script")[0]
      fjs?.parentNode?.insertBefore(js, fjs)
    }
  }, [])

  return null
}
