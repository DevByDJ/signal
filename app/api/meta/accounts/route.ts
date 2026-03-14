import { NextResponse } from "next/server"
import { resolveMetaAccess } from "@/lib/meta-access"
import { getAdAccounts } from "@/lib/facebook"

/**
 * GET /api/meta/accounts
 *
 * Returns the list of ad accounts accessible to the current user.
 * - agency_admin / admin: all accounts from their Meta token
 * - user: filtered to their assigned_account_ids
 *
 * Admins pass ?agencyId=<id> to proxy as a specific agency.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const agencyOverride = searchParams.get("agencyId")

  const access = await resolveMetaAccess(agencyOverride)

  if (!access) {
    return NextResponse.json(
      { error: "No Meta Ads integration found or not authorised." },
      { status: 403 }
    )
  }

  try {
    const accounts = await getAdAccounts(access.token)

    // Filter to allowed account IDs if the user has restrictions
    const filtered =
      access.allowedAccountIds && access.allowedAccountIds.length > 0
        ? accounts.filter((a) => {
            // The API returns ids prefixed with "act_", strip it for comparison
            const numericId = a.id.replace(/^act_/, "")
            return (
              access.allowedAccountIds!.includes(numericId) ||
              access.allowedAccountIds!.includes(a.id)
            )
          })
        : accounts

    return NextResponse.json({ accounts: filtered, agencyId: access.agencyId })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
