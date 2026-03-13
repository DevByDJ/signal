import { auth } from "@/lib/auth";
import type { CampaignWithMetrics } from "@/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricCard } from "@/components/dashboard/metric-card";
import { CampaignTable } from "@/components/ads/campaign-table";
import { Plus } from "lucide-react";

const mockCampaigns: CampaignWithMetrics[] = [
  {
    id: "1",
    name: "Lead Gen - Spring 2025",
    status: "ACTIVE",
    objective: "LEAD_GENERATION",
    daily_budget: 50,
    lifetime_budget: null,
    budget_remaining: 340,
    spend: 160,
    roas: 2.4,
  },
  {
    id: "2",
    name: "Retargeting - Website Visitors",
    status: "ACTIVE",
    objective: "CONVERSIONS",
    daily_budget: 30,
    lifetime_budget: null,
    budget_remaining: 210,
    spend: 90,
    roas: 3.1,
  },
  {
    id: "3",
    name: "Brand Awareness Q1",
    status: "PAUSED",
    objective: "BRAND_AWARENESS",
    daily_budget: 20,
    lifetime_budget: null,
    budget_remaining: 0,
    spend: 400,
    roas: null,
  },
  {
    id: "4",
    name: "Content Promo - Video",
    status: "ARCHIVED",
    objective: "VIDEO_VIEWS",
    daily_budget: null,
    lifetime_budget: 500,
    budget_remaining: 0,
    spend: 500,
    roas: 1.8,
  },
];

// Mock summary metrics
const mockSummary = {
  totalSpend: 1150,
  activeCampaigns: 2,
  totalReach: 125000,
  avgRoas: 2.75,
};

export default async function AdsPage() {
  await auth();

  const activeCampaigns = mockCampaigns.filter((c) => c.status === "ACTIVE");
  const pausedCampaigns = mockCampaigns.filter((c) => c.status === "PAUSED");
  const archivedCampaigns = mockCampaigns.filter(
    (c) => c.status === "ARCHIVED" || c.status === "DELETED"
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Ads</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your Facebook ad campaigns
          </p>
        </div>
        <Button>
          <Plus className="size-4" />
          New Campaign
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Spend"
          value={`$${mockSummary.totalSpend.toLocaleString()}`}
        />
        <MetricCard
          title="Active Campaigns"
          value={String(mockSummary.activeCampaigns)}
        />
        <MetricCard
          title="Total Reach"
          value={mockSummary.totalReach.toLocaleString()}
        />
        <MetricCard
          title="Avg ROAS"
          value={`${mockSummary.avgRoas}x`}
        />
      </div>

      <div className="space-y-4">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="paused">Paused</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <CampaignTable campaigns={mockCampaigns} />
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
  );
}
