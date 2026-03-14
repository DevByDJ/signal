"use server"

import { resolveMetaAccess } from "@/lib/meta-access"

const FB_API = "https://graph.facebook.com/v25.0"

export async function toggleCampaignStatus(
  campaignId: string,
  currentStatus: string
) {
  const access = await resolveMetaAccess()
  if (!access) throw new Error("Not authorised")

  const newStatus = currentStatus === "ACTIVE" ? "PAUSED" : "ACTIVE"

  const res = await fetch(`${FB_API}/${campaignId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: newStatus,
      access_token: access.token,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message ?? "Failed to update campaign status")
  }

  return { success: true, newStatus }
}
