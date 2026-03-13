"use server";

export async function toggleCampaignStatus(campaignId: string, currentStatus: string) {
  // Stub: log for now, will integrate with Facebook API later
  console.log("toggleCampaignStatus", { campaignId, currentStatus });
}
