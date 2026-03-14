import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// POST — upsert Meta Ads integration for the authenticated user
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json() as {
    accessToken: string
    userID: string
    expiresIn: string
  }

  if (!body.accessToken || !body.userID) {
    return NextResponse.json({ error: "Missing accessToken or userID" }, { status: 400 })
  }

  // expiresIn from FB is seconds from now
  const expiresAt = body.expiresIn
    ? new Date(Date.now() + parseInt(body.expiresIn, 10) * 1000).toISOString()
    : null

  const { error } = await supabase.from("integrations").upsert(
    {
      user_id: user.id,
      platform: "meta_ads",
      access_token: body.accessToken,
      expires_at: expiresAt,
      metadata: { fb_user_id: body.userID },
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,platform" }
  )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

// DELETE — remove Meta Ads integration for the authenticated user
export async function DELETE() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { error } = await supabase
    .from("integrations")
    .delete()
    .eq("user_id", user.id)
    .eq("platform", "meta_ads")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
