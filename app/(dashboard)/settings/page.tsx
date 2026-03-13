import { auth } from "@/lib/auth"
import { SettingsForm } from "@/components/settings/settings-form"

export default async function SettingsPage() {
  const session = await auth()

  if (!session?.user) {
    return null
  }

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
          name: session.user.name ?? null,
          email: session.user.email ?? null,
          image: session.user.image ?? null,
        }}
        facebookUserId={session.facebookUserId}
      />
    </div>
  )
}
