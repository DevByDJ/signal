import { IconInnerShadowTop } from "@tabler/icons-react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { OnboardingForm } from "./onboarding-form"

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role) redirect("/dashboard")

  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* Minimal header — logo only, no nav */}
      <header className="flex h-14 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <IconInnerShadowTop className="size-5 text-foreground" />
          <span className="text-base font-semibold">Signal</span>
        </div>
      </header>

      {/* Centered content */}
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Welcome to Signal</h1>
            <p className="mt-3 text-muted-foreground">
              How would you like to use Signal? You can always change this later.
            </p>
          </div>
          <OnboardingForm />
        </div>
      </main>
    </div>
  )
}
