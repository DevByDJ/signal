"use client"

import { useState, useEffect, useCallback } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { IconChevronRight, IconLoader2 } from "@tabler/icons-react"
import { toast } from "sonner"
import type { FacebookStatusResponse } from "./facebook-sdk-provider"

type ConnectionState = "loading" | "connected" | "disconnected"

export function MetaConnectButton() {
  const { data: session, status } = useSession()
  const [connectionState, setConnectionState] = useState<ConnectionState>("loading")
  const [isWorking, setIsWorking] = useState(false)

  // Resolve initial connection state from session + FB SDK status
  useEffect(() => {
    if (status === "loading") return

    if (session?.accessToken) {
      setConnectionState("connected")
      return
    }

    // Check FB SDK login status for a more accurate real-time check
    if (typeof window !== "undefined" && window.FB) {
      window.FB.getLoginStatus((response: FacebookStatusResponse) => {
        setConnectionState(response.status === "connected" ? "connected" : "disconnected")
      })
    } else {
      setConnectionState("disconnected")
    }
  }, [session, status])

  const handleConnect = useCallback(async () => {
    setIsWorking(true)
    try {
      if (typeof window === "undefined" || !window.FB) {
        // Fall back to Auth.js OAuth redirect if SDK not loaded
        await signIn("facebook", { callbackUrl: "/integrations" })
        return
      }

      window.FB.login(
        async (response: FacebookStatusResponse) => {
          if (response.status === "connected") {
            // Create the Auth.js server-side session
            await signIn("facebook", { callbackUrl: "/integrations" })
          } else {
            toast.error("Facebook login was cancelled or failed. Please try again.")
            setIsWorking(false)
          }
        },
        { scope: "email,public_profile,ads_read,ads_management,leads_retrieval" }
      )
    } catch {
      toast.error("Something went wrong. Please try again.")
      setIsWorking(false)
    }
  }, [])

  const handleDisconnect = useCallback(async () => {
    setIsWorking(true)
    try {
      if (typeof window !== "undefined" && window.FB) {
        window.FB.logout(() => {})
      }
      await signOut({ callbackUrl: "/integrations" })
    } catch {
      toast.error("Failed to disconnect. Please try again.")
      setIsWorking(false)
    }
  }, [])

  if (connectionState === "loading" || status === "loading") {
    return (
      <span className="flex items-center gap-1 text-sm text-muted-foreground">
        <IconLoader2 className="size-3.5 animate-spin" />
      </span>
    )
  }

  if (connectionState === "connected") {
    return (
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-500">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Connected
        </span>
        <button
          onClick={handleDisconnect}
          disabled={isWorking}
          className="flex items-center gap-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
        >
          {isWorking ? (
            <IconLoader2 className="size-3.5 animate-spin" />
          ) : (
            <>Manage <IconChevronRight className="size-3.5" /></>
          )}
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isWorking}
      className="flex items-center gap-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
    >
      {isWorking ? (
        <IconLoader2 className="size-3.5 animate-spin" />
      ) : (
        <>Connect <IconChevronRight className="size-3.5" /></>
      )}
    </button>
  )
}
