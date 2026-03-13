"use client";

import { Play, Pause, ExternalLink } from "lucide-react";
import type { CampaignWithMetrics } from "@/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toggleCampaignStatus } from "@/app/(dashboard)/ads/actions";

function formatObjective(objective: string): string {
  return objective
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}

function formatBudget(daily: number | null, lifetime: number | null): string {
  if (daily != null) return `$${daily}/day`;
  if (lifetime != null) return `$${lifetime} total`;
  return "—";
}

function getStatusBadgeVariant(
  status: CampaignWithMetrics["status"]
): "default" | "secondary" | "outline" {
  switch (status) {
    case "ACTIVE":
      return "default";
    case "PAUSED":
      return "secondary";
    case "ARCHIVED":
    case "DELETED":
      return "outline";
    default:
      return "outline";
  }
}

function getStatusBadgeClassName(status: CampaignWithMetrics["status"]): string {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    case "PAUSED":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    case "ARCHIVED":
    case "DELETED":
      return "bg-muted text-muted-foreground";
    default:
      return "";
  }
}

interface CampaignTableProps {
  campaigns: CampaignWithMetrics[];
}

export function CampaignTable({ campaigns }: CampaignTableProps) {
  async function handleToggle(campaignId: string, currentStatus: string) {
    await toggleCampaignStatus(campaignId, currentStatus);
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Campaign Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Objective</TableHead>
          <TableHead>Daily Budget</TableHead>
          <TableHead>Spend</TableHead>
          <TableHead>ROAS</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((campaign) => (
          <TableRow key={campaign.id}>
            <TableCell className="font-medium">{campaign.name}</TableCell>
            <TableCell>
              <Badge
                variant={getStatusBadgeVariant(campaign.status)}
                className={getStatusBadgeClassName(campaign.status)}
              >
                {campaign.status}
              </Badge>
            </TableCell>
            <TableCell>{formatObjective(campaign.objective)}</TableCell>
            <TableCell>
              {formatBudget(campaign.daily_budget, campaign.lifetime_budget)}
            </TableCell>
            <TableCell>${campaign.spend.toLocaleString()}</TableCell>
            <TableCell>
              {campaign.roas != null ? `${campaign.roas.toFixed(2)}x` : "—"}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                {campaign.status !== "ARCHIVED" && campaign.status !== "DELETED" && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleToggle(campaign.id, campaign.status)}
                    aria-label={
                      campaign.status === "ACTIVE" ? "Pause campaign" : "Resume campaign"
                    }
                  >
                    {campaign.status === "ACTIVE" ? (
                      <Pause className="size-4" />
                    ) : (
                      <Play className="size-4" />
                    )}
                  </Button>
                )}
                <a
                  href={`https://business.facebook.com/adsmanager/manage/campaigns?act=0&selected_campaign_ids=${campaign.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                  aria-label="View campaign"
                >
                  <ExternalLink className="size-4" />
                </a>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
