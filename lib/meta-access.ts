/**
 * Resolves the Meta Ads access token and the list of ad account IDs
 * that the currently authenticated user is allowed to access.
 *
 * Access rules:
 *   admin       → reads the agency from the `x-admin-agency` cookie (set by AdminAgencySelector)
 *   agency_admin → reads their own agency's token
 *   user         → reads their agency's token but filtered to assigned_account_ids
 */

import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

export const ADMIN_AGENCY_COOKIE = "signal_admin_agency"

export interface MetaAccess {
  token: string
  /** null means the user can access ALL accounts returned by the token */
  allowedAccountIds: string[] | null
  agencyId: string
  role: string
}

export async function resolveMetaAccess(
  /** Explicit agency override — takes precedence over cookie for admin role */
  agencyOverrideId?: string | null
): Promise<MetaAccess | null> {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  const role = profile?.role as string | null
  if (!role) return null

  if (role === "admin") {
    // Resolve target agency: explicit param > cookie
    const cookieStore = await cookies()
    const cookieAgencyId = cookieStore.get(ADMIN_AGENCY_COOKIE)?.value
    const targetAgencyId = agencyOverrideId ?? cookieAgencyId ?? null
    if (!targetAgencyId) return null

    const { data: integration } = await supabase
      .from("integrations")
      .select("access_token, agency_id")
      .eq("platform", "meta_ads")
      .eq("agency_id", targetAgencyId)
      .maybeSingle()

    if (!integration?.access_token) return null

    return {
      token: integration.access_token,
      allowedAccountIds: null,
      agencyId: targetAgencyId,
      role,
    }
  }

  if (role === "agency_admin") {
    const { data: integration } = await supabase
      .from("integrations")
      .select("access_token, agency_id")
      .eq("user_id", user.id)
      .eq("platform", "meta_ads")
      .maybeSingle()

    if (!integration?.access_token || !integration.agency_id) return null

    return {
      token: integration.access_token,
      allowedAccountIds: null,
      agencyId: integration.agency_id,
      role,
    }
  }

  if (role === "user") {
    const { data: membership } = await supabase
      .from("agency_members")
      .select("agency_id, assigned_account_ids")
      .eq("user_id", user.id)
      .maybeSingle()

    if (!membership?.agency_id) return null

    const { data: integration } = await supabase
      .from("integrations")
      .select("access_token")
      .eq("platform", "meta_ads")
      .eq("agency_id", membership.agency_id)
      .maybeSingle()

    if (!integration?.access_token) return null

    return {
      token: integration.access_token,
      allowedAccountIds: membership.assigned_account_ids ?? null,
      agencyId: membership.agency_id,
      role,
    }
  }

  return null
}
