/**
 * Facebook Marketing API v25.0 helpers.
 * All functions are server-only — access tokens must never be exposed to the client.
 */

const FB_API = "https://graph.facebook.com/v25.0"

export type DatePreset =
  | "today"
  | "yesterday"
  | "last_7d"
  | "last_14d"
  | "last_28d"
  | "last_30d"
  | "last_90d"
  | "this_month"
  | "last_month"
  | "this_year"

// ---------- Response shapes ----------

export interface FBAdAccount {
  id: string
  name: string
  currency: string
  account_status: number // 1=Active, 2=Disabled, 3=Unsettled, 7=PendingRiskReview, 9=InGracePeriod
  timezone_name: string
}

export interface FBCampaign {
  id: string
  name: string
  status: "ACTIVE" | "PAUSED" | "DELETED" | "ARCHIVED"
  objective: string
  daily_budget?: string
  lifetime_budget?: string
  start_time?: string
  stop_time?: string
}

export interface FBInsights {
  account_id?: string
  campaign_id?: string
  date_start: string
  date_stop: string
  spend: string
  impressions: string
  clicks: string
  ctr: string
  cpm: string
  cpc: string
  reach: string
  actions?: Array<{ action_type: string; value: string }>
  action_values?: Array<{ action_type: string; value: string }>
}

export interface FBPaged<T> {
  data: T[]
  paging?: { cursors?: { before: string; after: string }; next?: string }
  error?: { message: string; type: string; code: number }
}

// ---------- Helpers ----------

async function fbFetch<T>(path: string, token: string): Promise<T> {
  const url = new URL(`${FB_API}${path}`)
  url.searchParams.set("access_token", token)
  const res = await fetch(url.toString(), { next: { revalidate: 60 } })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      err?.error?.message ?? `Facebook API error ${res.status}: ${path}`
    )
  }
  return res.json() as Promise<T>
}

// ---------- API Functions ----------

/**
 * List all ad accounts accessible by the token owner.
 * For Agency Admins this covers all accounts in their Business Manager.
 */
export async function getAdAccounts(
  token: string
): Promise<FBAdAccount[]> {
  const fields = "id,name,currency,account_status,timezone_name"
  const data = await fbFetch<FBPaged<FBAdAccount>>(
    `/me/adaccounts?fields=${fields}&limit=100`,
    token
  )
  if (data.error) throw new Error(data.error.message)
  return data.data ?? []
}

/**
 * List campaigns for a single ad account.
 * accountId should be the bare numeric ID (without "act_" prefix).
 */
export async function getCampaigns(
  accountId: string,
  token: string
): Promise<FBCampaign[]> {
  const fields =
    "id,name,status,objective,daily_budget,lifetime_budget,start_time,stop_time"
  const data = await fbFetch<FBPaged<FBCampaign>>(
    `/act_${accountId}/campaigns?fields=${fields}&limit=100`,
    token
  )
  if (data.error) throw new Error(data.error.message)
  return data.data ?? []
}

/**
 * Account-level aggregated insights over a date preset.
 * Returns an array — typically one entry (the aggregated row).
 */
export async function getAccountInsights(
  accountId: string,
  token: string,
  datePreset: DatePreset = "last_30d"
): Promise<FBInsights[]> {
  const fields =
    "account_id,spend,impressions,clicks,ctr,cpm,cpc,reach,actions,action_values,date_start,date_stop"
  const data = await fbFetch<FBPaged<FBInsights>>(
    `/act_${accountId}/insights?fields=${fields}&date_preset=${datePreset}&level=account`,
    token
  )
  if (data.error) throw new Error(data.error.message)
  return data.data ?? []
}

/**
 * Campaign-level insights broken down per campaign.
 */
export async function getCampaignInsights(
  accountId: string,
  token: string,
  datePreset: DatePreset = "last_30d"
): Promise<FBInsights[]> {
  const fields =
    "campaign_id,spend,impressions,clicks,ctr,cpm,cpc,reach,actions,date_start,date_stop"
  const data = await fbFetch<FBPaged<FBInsights>>(
    `/act_${accountId}/insights?fields=${fields}&date_preset=${datePreset}&level=campaign`,
    token
  )
  if (data.error) throw new Error(data.error.message)
  return data.data ?? []
}

/**
 * Insights for a single campaign.
 */
export async function getSingleCampaignInsights(
  campaignId: string,
  token: string,
  datePreset: DatePreset = "last_30d"
): Promise<FBInsights[]> {
  const fields =
    "campaign_id,spend,impressions,clicks,ctr,cpm,cpc,reach,date_start,date_stop"
  const data = await fbFetch<FBPaged<FBInsights>>(
    `/${campaignId}/insights?fields=${fields}&date_preset=${datePreset}`,
    token
  )
  if (data.error) throw new Error(data.error.message)
  return data.data ?? []
}

// ---------- Utility ----------

/** Extract the numeric lead count from an insights actions array. */
export function extractLeads(insights: FBInsights): number {
  const leadAction = insights.actions?.find(
    (a) =>
      a.action_type === "lead" ||
      a.action_type === "onsite_conversion.lead_grouped"
  )
  return leadAction ? parseInt(leadAction.value, 10) : 0
}

/** Extract purchase conversion value (ROAS numerator). */
export function extractPurchaseValue(insights: FBInsights): number {
  const purchaseValue = insights.action_values?.find(
    (a) => a.action_type === "purchase" || a.action_type === "offsite_conversion.fb_pixel_purchase"
  )
  return purchaseValue ? parseFloat(purchaseValue.value) : 0
}

/** Calculate ROAS: purchase value / spend */
export function calculateRoas(insights: FBInsights): number | null {
  const spend = parseFloat(insights.spend)
  if (!spend) return null
  const purchaseValue = extractPurchaseValue(insights)
  return purchaseValue ? parseFloat((purchaseValue / spend).toFixed(2)) : null
}
