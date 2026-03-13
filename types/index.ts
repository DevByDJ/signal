// Contact/Lead (CRM)
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

// Proposal
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

// Facebook Ad Account
export interface AdAccount {
  id: string
  name: string
  currency: string
  timezone: string
}

// Facebook Campaign
export interface Campaign {
  id: string
  name: string
  status: "ACTIVE" | "PAUSED" | "DELETED" | "ARCHIVED"
  objective: string
  budget_remaining: number | null
  daily_budget: number | null
  lifetime_budget: number | null
}

// Campaign with display metrics (spend, roas from Insights API)
export interface CampaignWithMetrics extends Campaign {
  spend: number
  roas: number | null
}

// Dashboard Metrics (from Facebook Insights API)
export interface DashboardMetrics {
  total_spend: number
  leads: number
  cost_per_lead: number
  roas: number
  ctr: number
  cpc: number
}
