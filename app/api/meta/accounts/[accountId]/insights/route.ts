import { NextResponse } from "next/server"
import { resolveMetaAccess } from "@/lib/meta-access"
import {
  getAccountInsights,
  getCampaignInsights,
  type DatePreset,
} from "@/lib/facebook"

/**
 * GET /api/meta/accounts/[accountId]/insights
 *
 * Query params:
 *   date_preset  — one of the DatePreset values (default: last_30d)
 *   level        — "account" (default) or "campaign"
 *   agencyId     — for admin role proxy
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ accountId: string }> }
) {
  const { accountId } = await params
  const { searchParams } = new URL(request.url)
  const agencyOverride = searchParams.get("agencyId")
  const datePreset = (searchParams.get("date_preset") ?? "last_30d") as DatePreset
  const level = searchParams.get("level") ?? "account"

  const access = await resolveMetaAccess(agencyOverride)
  if (!access) {
    return NextResponse.json({ error: "Not authorised." }, { status: 403 })
  }

  // Enforce allowed account IDs for regular users
  if (access.allowedAccountIds && access.allowedAccountIds.length > 0) {
    const numericId = accountId.replace(/^act_/, "")
    const allowed =
      access.allowedAccountIds.includes(numericId) ||
      access.allowedAccountIds.includes(accountId)
    if (!allowed) {
      return NextResponse.json({ error: "Account not accessible." }, { status: 403 })
    }
  }

  try {
    const numericId = accountId.replace(/^act_/, "")
    const insights =
      level === "campaign"
        ? await getCampaignInsights(numericId, access.token, datePreset)
        : await getAccountInsights(numericId, access.token, datePreset)

    return NextResponse.json({ insights, datePreset, level })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
