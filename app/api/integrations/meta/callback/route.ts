import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const FB_API = "https://graph.facebook.com/v19.0"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error || !code) {
    return NextResponse.redirect(`${origin}/integrations?error=meta_cancelled`)
  }

  // Verify the user is authenticated with Signal
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.redirect(`${origin}/login`)
  }

  // Exchange the code for an access token (server-side — client_secret never exposed)
  const redirectUri = `${origin}/api/integrations/meta/callback`
  const tokenUrl = new URL(`${FB_API}/oauth/access_token`)
  tokenUrl.searchParams.set("client_id", process.env.AUTH_FACEBOOK_ID!)
  tokenUrl.searchParams.set("redirect_uri", redirectUri)
  tokenUrl.searchParams.set("client_secret", process.env.AUTH_FACEBOOK_SECRET!)
  tokenUrl.searchParams.set("code", code)

  const tokenRes = await fetch(tokenUrl.toString())
  if (!tokenRes.ok) {
    return NextResponse.redirect(`${origin}/integrations?error=meta_token_failed`)
  }

  const tokenData = (await tokenRes.json()) as {
    access_token: string
    token_type: string
    expires_in?: number
  }

  // Fetch the Facebook user ID
  const meRes = await fetch(
    `${FB_API}/me?fields=id&access_token=${tokenData.access_token}`
  )
  const meData = (await meRes.json()) as { id?: string }

  const expiresAt = tokenData.expires_in
    ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
    : null

  // Upsert into integrations table
  const { error: dbError } = await supabase.from("integrations").upsert(
    {
      user_id: user.id,
      platform: "meta_ads",
      access_token: tokenData.access_token,
      expires_at: expiresAt,
      metadata: { fb_user_id: meData.id ?? null },
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,platform" }
  )

  if (dbError) {
    return NextResponse.redirect(`${origin}/integrations?error=meta_save_failed`)
  }

  return NextResponse.redirect(`${origin}/integrations?connected=meta`)
}
