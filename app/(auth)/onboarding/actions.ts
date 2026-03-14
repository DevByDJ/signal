"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function createAgencyAction(formData: FormData) {
  const agencyName = (formData.get("agencyName") as string)?.trim()
  if (!agencyName) throw new Error("Agency name is required")

  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) redirect("/login")

  const { data: agency, error: agencyError } = await supabase
    .from("agencies")
    .insert({ name: agencyName, owner_id: user.id })
    .select("id")
    .single()

  if (agencyError || !agency) throw new Error("Failed to create agency")

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ role: "agency_admin" })
    .eq("id", user.id)

  if (profileError) throw new Error("Failed to update profile role")

  redirect("/integrations")
}

export async function joinAsUserAction() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) redirect("/login")

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ role: "user" })
    .eq("id", user.id)

  if (profileError) throw new Error("Failed to update profile role")

  redirect("/dashboard")
}
