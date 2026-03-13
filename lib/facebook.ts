import type { Campaign, DashboardMetrics } from "@/types"

const FACEBOOK_GRAPH_API = "https://graph.facebook.com/v19.0"

const CACHE_OPTIONS = { next: { revalidate: 300 } } as RequestInit

/** Raw Facebook Insights API response */
interface FacebookInsightsResponse {
  data?: Array<{
    spend?: string
    ctr?: string
    cpc?: string
    purchase_roas?: Array<{ value: string }>
    actions?: Array<{ action_type: string; value: string }>
  }>
}

/** Raw Facebook Campaigns API response */
interface FacebookCampaignsResponse {
  data?: Array<{
    id: string
    name: string
    status: string
    objective?: string
    budget_remaining?: string
    daily_budget?: string
    lifetime_budget?: string
  }>
}

/** Normalize account ID to include act_ prefix if missing */
function normalizeAccountId(accountId: string): string {
  return accountId.startsWith("act_") ? accountId : `act_${accountId}`
}

/**
 * Fetches ad account insights (spend, ctr, cpc, purchase_roas, actions/leads).
 * Use in Server Components or Route Handlers for 5-min caching.
 */
export async function getAdInsights(
  accountId: string,
  token: string
): Promise<DashboardMetrics> {
  const id = normalizeAccountId(accountId)
  const fields = [
    "spend",
    "ctr",
    "cpc",
    "purchase_roas",
    "actions",
  ].join(",")
  const params = new URLSearchParams({
    fields,
    time_preset: "last_30d",
    access_token: token,
  })
  const url = `${FACEBOOK_GRAPH_API}/${id}/insights?${params}`
  const res = await fetch(url, CACHE_OPTIONS)

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Facebook Insights API error: ${res.status} ${err}`)
  }

  const json = (await res.json()) as FacebookInsightsResponse
  const row = json.data?.[0]

  const spend = parseFloat(row?.spend ?? "0") || 0
  const ctr = parseFloat(row?.ctr ?? "0") || 0
  const cpc = parseFloat(row?.cpc ?? "0") || 0

  let roas = 0
  const roasValue = row?.purchase_roas?.[0]?.value
  if (roasValue) {
    const parsed = parseFloat(roasValue)
    roas = Number.isFinite(parsed) ? parsed : 0
  }

  let leads = 0
  for (const action of row?.actions ?? []) {
    const type = action.action_type?.toLowerCase() ?? ""
    if (type === "lead" || type === "offsite_conversion.fb_pixel_lead") {
      leads += parseInt(action.value ?? "0", 10) || 0
    }
  }

  const cost_per_lead = leads > 0 ? spend / leads : 0

  return {
    total_spend: spend,
    leads,
    cost_per_lead,
    roas,
    ctr,
    cpc,
  }
}

/**
 * Fetches campaigns for an ad account.
 * Use in Server Components or Route Handlers for 5-min caching.
 */
export async function getCampaigns(
  accountId: string,
  token: string
): Promise<Campaign[]> {
  const id = normalizeAccountId(accountId)
  const fields = [
    "id",
    "name",
    "status",
    "objective",
    "budget_remaining",
    "daily_budget",
    "lifetime_budget",
  ].join(",")

  const url = `${FACEBOOK_GRAPH_API}/${id}/campaigns?fields=${fields}&access_token=${encodeURIComponent(token)}`
  const res = await fetch(url, CACHE_OPTIONS)

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Facebook Campaigns API error: ${res.status} ${err}`)
  }

  const json = (await res.json()) as FacebookCampaignsResponse
  const data = json.data ?? []

  return data.map((c) => ({
    id: c.id,
    name: c.name,
    status: c.status as Campaign["status"],
    objective: c.objective ?? "",
    budget_remaining: c.budget_remaining != null ? parseFloat(c.budget_remaining) : null,
    daily_budget: c.daily_budget != null ? parseFloat(c.daily_budget) : null,
    lifetime_budget: c.lifetime_budget != null ? parseFloat(c.lifetime_budget) : null,
  }))
}

/**
 * Updates a campaign's status (ACTIVE or PAUSED).
 */
export async function updateCampaignStatus(
  campaignId: string,
  status: "ACTIVE" | "PAUSED",
  token: string
): Promise<void> {
  const url = `${FACEBOOK_GRAPH_API}/${campaignId}?access_token=${encodeURIComponent(token)}`
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Facebook Campaign update error: ${res.status} ${err}`)
  }
}
