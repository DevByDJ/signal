// ---------- Auth / Roles ----------

export type Role = "admin" | "agency_admin" | "user"

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: Role | null
  created_at: string
  updated_at: string
}

// ---------- Agency ----------

export interface Agency {
  id: string
  name: string
  owner_id: string
  created_at: string
  updated_at: string
}

export interface AgencyMember {
  id: string
  agency_id: string
  user_id: string
  /** null = access to all agency accounts */
  assigned_account_ids: string[] | null
  invited_by: string | null
  created_at: string
  /** Joined from profiles */
  profile?: Pick<Profile, "full_name" | "avatar_url"> & { email?: string }
}

// ---------- Contact/Lead (CRM) ----------

export interface Contact {
  id: string
  name: string
  email: string | null
  phone: string | null
  stage: "new_lead" | "contacted" | "qualified" | "opportunity" | "converted"
  source: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

// ---------- Proposal ----------

export interface Proposal {
  id: string
  contact_id: string
  title: string
  client_name: string | null
  value: number | null
  status: "draft" | "sent" | "accepted" | "rejected"
  created_at: string
  updated_at: string
}

// ---------- Facebook Ad Account ----------

export interface AdAccount {
  id: string
  name: string
  currency: string
  timezone: string
  /** 1=Active 2=Disabled 3=Unsettled 7=PendingRiskReview 9=InGracePeriod */
  account_status?: number
  timezone_name?: string
}

// ---------- Facebook Campaign ----------

export interface Campaign {
  id: string
  name: string
  status: "ACTIVE" | "PAUSED" | "DELETED" | "ARCHIVED"
  objective: string
  budget_remaining: number | null
  daily_budget: number | null
  lifetime_budget: number | null
}

// ---------- Campaign with live Insights metrics ----------

export interface CampaignWithMetrics extends Campaign {
  spend: number
  roas: number | null
  reach?: number
  impressions?: number
  clicks?: number
  ctr?: number
  cpm?: number
  leads?: number
}

// ---------- Insights (Facebook Marketing API v25.0) ----------

export interface InsightMetrics {
  account_id?: string
  campaign_id?: string
  date_start: string
  date_stop: string
  spend: number
  impressions: number
  clicks: number
  /** Click-through rate (percentage) */
  ctr: number
  /** Cost per thousand impressions */
  cpm: number
  /** Cost per click */
  cpc: number
  reach: number
  leads: number
  purchase_value: number
  roas: number | null
}

// ---------- Dashboard summary ----------

export interface DashboardMetrics {
  total_spend: number
  leads: number
  cost_per_lead: number
  roas: number
  ctr: number
  cpc: number
}
