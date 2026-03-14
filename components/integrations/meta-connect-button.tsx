"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { IconChevronRight, IconLoader2 } from "@tabler/icons-react"
import { toast } from "sonner"

type ConnectionState = "loading" | "connected" | "disconnected"

const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!
const APP_URL = process.env.NEXT_PUBLIC_APP_URL
const SCOPES = "public_profile,ads_read,ads_management,leads_retrieval"

export function MetaConnectButton() {
  const [connectionState, setConnectionState] = useState<ConnectionState>("loading")
  const [isWorking, setIsWorking] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

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

  // Handle ?connected=meta and ?error= query params set by the OAuth callback
  useEffect(() => {
    const connected = searchParams.get("connected")
    const error = searchParams.get("error")
    if (connected === "meta") {
      setConnectionState("connected")
      toast.success("Meta Ads connected successfully!")
      router.replace("/integrations")
    } else if (error === "meta_cancelled") {
      toast.info("Meta connection cancelled.")
      router.replace("/integrations")
    } else if (error) {
      toast.error("Meta connection failed. Please try again.")
      router.replace("/integrations")
    }
  }, [searchParams, router])

  const handleConnect = useCallback(() => {
    setIsWorking(true)
    const base = APP_URL ?? window.location.origin
    const redirectUri = `${base}/api/integrations/meta/callback`
    const authUrl =
      `https://www.facebook.com/v19.0/dialog/oauth` +
      `?client_id=${FACEBOOK_APP_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(SCOPES)}` +
      `&response_type=code`
    // Log the exact redirect_uri so you can verify it matches the Meta app settings
    console.log("[Meta OAuth] redirect_uri:", redirectUri)
    console.log("[Meta OAuth] full auth URL:", authUrl)
    window.location.href = authUrl
  }, [])

  const handleDisconnect = useCallback(async () => {
    setIsWorking(true)
    try {
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

  if (connectionState === "loading") {
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
