import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetricCard } from "@/components/dashboard/metric-card"
import { CampaignTable } from "@/components/ads/campaign-table"
import { AccountSelector } from "@/components/ads/account-selector"
import { Plus, AlertCircle } from "lucide-react"
import { resolveMetaAccess } from "@/lib/meta-access"
import {
  getAdAccounts,
  getCampaigns,
  getCampaignInsights,
  extractLeads,
  calculateRoas,
  type FBAdAccount,
  type FBCampaign,
  type FBInsights,
} from "@/lib/facebook"
import type { CampaignWithMetrics } from "@/types"

interface AdsPageProps {
  searchParams: Promise<{ accountId?: string; agencyId?: string }>
}

function mergeInsights(
  campaigns: FBCampaign[],
  insights: FBInsights[]
): CampaignWithMetrics[] {
  const insightMap = new Map(insights.map((i) => [i.campaign_id, i]))
  return campaigns.map((c) => {
    const insight = insightMap.get(c.id)
    return {
      id: c.id,
      name: c.name,
      status: c.status,
      objective: c.objective,
      daily_budget: c.daily_budget ? parseFloat(c.daily_budget) / 100 : null,
      lifetime_budget: c.lifetime_budget
        ? parseFloat(c.lifetime_budget) / 100
        : null,
      budget_remaining: null,
      spend: insight ? parseFloat(insight.spend) : 0,
      reach: insight ? parseInt(insight.reach, 10) : 0,
      impressions: insight ? parseInt(insight.impressions, 10) : 0,
      clicks: insight ? parseInt(insight.clicks, 10) : 0,
      ctr: insight ? parseFloat(insight.ctr) : 0,
      cpm: insight ? parseFloat(insight.cpm) : 0,
      leads: insight ? extractLeads(insight) : 0,
      roas: insight ? calculateRoas(insight) : null,
    }
  })
}

export default async function AdsPage({ searchParams }: AdsPageProps) {
  const { accountId: rawAccountId, agencyId } = await searchParams
  const access = await resolveMetaAccess(agencyId ?? null)

  if (!access) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h1 className="text-2xl font-bold tracking-tight">Ads</h1>
        </div>
        <div className="mx-4 flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-amber-600 dark:text-amber-400 lg:mx-6">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <div>
            <p className="font-medium">Meta Ads not connected</p>
            <p className="mt-0.5 text-sm">
              {access === null
                ? "Your agency admin hasn't connected a Meta Ads account yet, or you haven't been assigned to an agency."
                : "Connect your Meta Ads account on the Integrations page to view live campaign data."}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Fetch all accessible ad accounts
  let accounts: FBAdAccount[] = []
  let fetchError: string | null = null

  try {
    accounts = await getAdAccounts(access.token)

    // Filter to allowed accounts for regular users
    if (access.allowedAccountIds && access.allowedAccountIds.length > 0) {
      accounts = accounts.filter((a) => {
        const numericId = a.id.replace(/^act_/, "")
        return (
          access.allowedAccountIds!.includes(numericId) ||
          access.allowedAccountIds!.includes(a.id)
        )
      })
    }
  } catch (err) {
    fetchError = err instanceof Error ? err.message : "Failed to load ad accounts"
  }

  if (fetchError) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h1 className="text-2xl font-bold tracking-tight">Ads</h1>
        </div>
        <div className="mx-4 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive lg:mx-6">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p className="text-sm">{fetchError}</p>
        </div>
      </div>
    )
  }

  if (accounts.length === 0) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h1 className="text-2xl font-bold tracking-tight">Ads</h1>
          <p className="text-muted-foreground">No ad accounts found in your Meta Business Manager.</p>
        </div>
      </div>
    )
  }

  // Determine selected account
  const selectedNumericId =
    rawAccountId ?? accounts[0].id.replace(/^act_/, "")
  const selectedAccount =
    accounts.find((a) => a.id.replace(/^act_/, "") === selectedNumericId) ??
    accounts[0]

  // Fetch campaigns + insights for the selected account
  let campaigns: CampaignWithMetrics[] = []
  try {
    const [rawCampaigns, insightsData] = await Promise.all([
      getCampaigns(selectedNumericId, access.token),
      getCampaignInsights(selectedNumericId, access.token, "last_30d"),
    ])
    campaigns = mergeInsights(rawCampaigns, insightsData)
  } catch (err) {
    fetchError = err instanceof Error ? err.message : "Failed to load campaigns"
  }

  const activeCampaigns = campaigns.filter((c) => c.status === "ACTIVE")
  const pausedCampaigns = campaigns.filter((c) => c.status === "PAUSED")
  const archivedCampaigns = campaigns.filter(
    (c) => c.status === "ARCHIVED" || c.status === "DELETED"
  )

  const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0)
  const totalReach = campaigns.reduce((sum, c) => sum + (c.reach ?? 0), 0)
  const roasValues = campaigns
    .map((c) => c.roas)
    .filter((r): r is number => r !== null)
  const avgRoas =
    roasValues.length > 0
      ? roasValues.reduce((a, b) => a + b, 0) / roasValues.length
      : null

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex flex-col gap-4 px-4 sm:flex-row sm:items-end sm:justify-between lg:px-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ads</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {selectedAccount.name} · {selectedAccount.currency} ·{" "}
            {selectedAccount.timezone_name}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Suspense>
            <AccountSelector
              accounts={accounts}
              selectedId={selectedNumericId}
            />
          </Suspense>
          <Button size="sm">
            <Plus className="size-4" />
            New Campaign
          </Button>
        </div>
      </div>

      <div className="grid gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <MetricCard
          title="Total Spend (30d)"
          value={`$${totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        />
        <MetricCard
          title="Active Campaigns"
          value={String(activeCampaigns.length)}
        />
        <MetricCard
          title="Total Reach (30d)"
          value={totalReach.toLocaleString()}
        />
        <MetricCard
          title="Avg ROAS (30d)"
          value={avgRoas !== null ? `${avgRoas.toFixed(2)}x` : "—"}
        />
      </div>

      {fetchError && (
        <div className="mx-4 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive lg:mx-6">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p className="text-sm">{fetchError}</p>
        </div>
      )}

      <div className="px-4 lg:px-6">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All ({campaigns.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({activeCampaigns.length})</TabsTrigger>
            <TabsTrigger value="paused">Paused ({pausedCampaigns.length})</TabsTrigger>
            <TabsTrigger value="archived">Archived ({archivedCampaigns.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <CampaignTable campaigns={campaigns} />
          </TabsContent>
          <TabsContent value="active" className="mt-4">
            <CampaignTable campaigns={activeCampaigns} />
          </TabsContent>
          <TabsContent value="paused" className="mt-4">
            <CampaignTable campaigns={pausedCampaigns} />
          </TabsContent>
          <TabsContent value="archived" className="mt-4">
            <CampaignTable campaigns={archivedCampaigns} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
