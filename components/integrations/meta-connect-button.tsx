"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { IconChevronRight, IconLoader2 } from "@tabler/icons-react"
import { toast } from "sonner"
import type { FacebookStatusResponse } from "./facebook-sdk-provider"

type ConnectionState = "loading" | "connected" | "disconnected"

export function MetaConnectButton() {
  const [connectionState, setConnectionState] = useState<ConnectionState>("loading")
  const [isWorking, setIsWorking] = useState(false)
  const router = useRouter()

  // Check if Meta Ads integration already exists in the integrations table
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setConnectionState("disconnected"); return }
      const { data } = await supabase
        .from("integrations")
        .select("id")
        .eq("user_id", user.id)
        .eq("platform", "meta_ads")
        .maybeSingle()
      setConnectionState(data ? "connected" : "disconnected")
    })
  }, [])

  const handleConnect = useCallback(async () => {
    setIsWorking(true)
    try {
      if (typeof window === "undefined" || !window.FB) {
        toast.error("Facebook SDK not loaded. Please refresh and try again.")
        setIsWorking(false)
        return
      }

      window.FB.login(
        async (response: FacebookStatusResponse) => {
          if (response.status === "connected" && response.authResponse) {
            const res = await fetch("/api/integrations/meta", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                accessToken: response.authResponse.accessToken,
                userID: response.authResponse.userID,
                expiresIn: response.authResponse.expiresIn,
              }),
            })
            if (res.ok) {
              setConnectionState("connected")
              toast.success("Meta Ads connected successfully!")
              router.refresh()
            } else {
              toast.error("Failed to save connection. Please try again.")
            }
          } else {
            toast.error("Facebook login was cancelled or failed. Please try again.")
          }
          setIsWorking(false)
        },
        { scope: "public_profile,ads_read,ads_management,leads_retrieval" }
      )
    } catch {
      toast.error("Something went wrong. Please try again.")
      setIsWorking(false)
    }
  }, [router])

  const handleDisconnect = useCallback(async () => {
    setIsWorking(true)
    try {
      if (typeof window !== "undefined" && window.FB) {
        window.FB.logout(() => {})
      }
      const res = await fetch("/api/integrations/meta", { method: "DELETE" })
      if (res.ok) {
        setConnectionState("disconnected")
        toast.success("Meta Ads disconnected.")
        router.refresh()
      } else {
        toast.error("Failed to disconnect. Please try again.")
      }
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsWorking(false)
    }
  }, [router])

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
