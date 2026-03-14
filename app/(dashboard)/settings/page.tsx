import { createClient } from "@/lib/supabase/server"
import { SettingsForm } from "@/components/settings/settings-form"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <SettingsForm
        user={{
          name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
          email: user.email ?? null,
          image: user.user_metadata?.avatar_url ?? null,
        }}
      />
    </div>
  )
}
