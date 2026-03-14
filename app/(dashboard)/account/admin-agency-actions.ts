"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { ADMIN_AGENCY_COOKIE } from "@/lib/meta-access"
import { createClient } from "@/lib/supabase/server"

export async function setAdminAgencyAction(agencyId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") return

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_AGENCY_COOKIE, agencyId, {
    path: "/",
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  revalidatePath("/", "layout")
}
