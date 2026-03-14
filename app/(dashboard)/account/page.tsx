import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { resolveMetaAccess } from "@/lib/meta-access"
import { getAdAccounts } from "@/lib/facebook"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MembersTable } from "@/components/account/members-table"
import { InviteMemberDialog } from "@/components/account/invite-member-dialog"
import { IconBuilding, IconLink } from "@tabler/icons-react"
import type { AgencyMember } from "@/types"

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "agency_admin" && profile?.role !== "admin") {
    redirect("/dashboard")
  }

  // Fetch agency info
  const { data: agency } = await supabase
    .from("agencies")
    .select("*")
    .eq("owner_id", user.id)
    .single()

  if (!agency) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h1 className="text-2xl font-bold tracking-tight">Account</h1>
          <p className="text-muted-foreground">No agency found.</p>
        </div>
      </div>
    )
  }

  // Fetch members with their profile info
  const { data: rawMembers } = await supabase
    .from("agency_members")
    .select("id, agency_id, user_id, assigned_account_ids, invited_by, created_at")
    .eq("agency_id", agency.id)
    .order("created_at")

  // Enrich members with profile data using a manual join
  const members: AgencyMember[] = []
  if (rawMembers && rawMembers.length > 0) {
    const userIds = rawMembers.map((m) => m.user_id)

    const { data: memberProfiles } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", userIds)

    // Get emails from auth.users via RPC
    const profileMap = new Map(memberProfiles?.map((p) => [p.id, p]) ?? [])

    for (const m of rawMembers) {
      const prof = profileMap.get(m.user_id)
      members.push({
        ...m,
        assigned_account_ids: m.assigned_account_ids ?? null,
        profile: prof
          ? { full_name: prof.full_name, avatar_url: prof.avatar_url }
          : undefined,
      })
    }
  }

  // Fetch Meta Ads integration status + ad accounts
  const metaIntegration = await supabase
    .from("integrations")
    .select("access_token, connected_at")
    .eq("user_id", user.id)
    .eq("platform", "meta_ads")
    .maybeSingle()

  const isMetaConnected = !!metaIntegration.data?.access_token

  let adAccounts: Awaited<ReturnType<typeof getAdAccounts>> = []
  const access = await resolveMetaAccess()
  if (access) {
    try {
      adAccounts = await getAdAccounts(access.token)
    } catch {
      // non-fatal — show empty list
    }
  }

  return (
    <div className="flex flex-col gap-6 py-4 md:gap-8 md:py-6">
      <div className="flex flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your agency, team members, and ad account access.
          </p>
        </div>
      </div>

      {/* Agency Info */}
      <div className="grid gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3 lg:px-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <IconBuilding className="size-4" />
              Agency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{agency.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Created {new Date(agency.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <IconLink className="size-4" />
              Meta Ads
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            {isMetaConnected ? (
              <>
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                >
                  Connected
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {adAccounts.length} ad account{adAccounts.length !== 1 ? "s" : ""}
                </span>
              </>
            ) : (
              <div>
                <Badge
                  variant="outline"
                  className="bg-muted text-muted-foreground"
                >
                  Not connected
                </Badge>
                <p className="mt-1 text-xs text-muted-foreground">
                  Connect on the{" "}
                  <a
                    href="/integrations"
                    className="underline underline-offset-2"
                  >
                    Integrations
                  </a>{" "}
                  page
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Team Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{members.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Active members in your agency
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Members Table */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Team Members</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage who has access and which ad accounts they can view.
              </p>
            </div>
            <InviteMemberDialog adAccounts={adAccounts} />
          </CardHeader>
          <CardContent>
            <MembersTable members={members} adAccounts={adAccounts} />
          </CardContent>
        </Card>
      </div>

      {/* Ad Accounts List */}
      {adAccounts.length > 0 && (
        <div className="px-4 lg:px-6">
          <Card>
            <CardHeader>
              <CardTitle>Connected Ad Accounts</CardTitle>
              <p className="text-sm text-muted-foreground">
                All Meta ad accounts accessible via your connected Business Manager.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {adAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between rounded-lg border px-4 py-3"
                  >
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {account.id} · {account.currency} ·{" "}
                        {account.timezone_name}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        account.account_status === 1
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {account.account_status === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
