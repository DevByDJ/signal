import { NextResponse } from "next/server"
import { resolveMetaAccess } from "@/lib/meta-access"
import { getCampaigns } from "@/lib/facebook"

/**
 * GET /api/meta/accounts/[accountId]/campaigns
 *
 * Returns campaigns for the given ad account, enforcing role-scoped access.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ accountId: string }> }
) {
  const { accountId } = await params
  const { searchParams } = new URL(request.url)
  const agencyOverride = searchParams.get("agencyId")

  const access = await resolveMetaAccess(agencyOverride)
  if (!access) {
    return NextResponse.json({ error: "Not authorised." }, { status: 403 })
  }

  // Verify this account is within the user's allowed set
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
    const campaigns = await getCampaigns(accountId.replace(/^act_/, ""), access.token)
    return NextResponse.json({ campaigns })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
