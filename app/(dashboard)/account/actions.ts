"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

/** Invite a user by email — looks them up and adds them to the agency. */
export async function inviteMemberAction(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase()
  const accountIds = formData.getAll("accountIds") as string[]

  if (!email) throw new Error("Email is required")

  const supabase = await createClient()
  const { data: { user: caller } } = await supabase.auth.getUser()
  if (!caller) throw new Error("Not authenticated")

  // Verify caller is agency_admin and get their agency
  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", caller.id)
    .single()

  if (callerProfile?.role !== "agency_admin" && callerProfile?.role !== "admin") {
    throw new Error("Insufficient permissions")
  }

  const { data: agency } = await supabase
    .from("agencies")
    .select("id")
    .eq("owner_id", caller.id)
    .single()

  if (!agency) throw new Error("Agency not found")

  // Use a raw SQL approach via Supabase to find user by email
  const { data: userData, error: userError } = await supabase.rpc(
    "get_user_id_by_email",
    { user_email: email }
  )

  if (userError || !userData) {
    throw new Error(
      "No Signal account found for that email address. Ask them to sign up first."
    )
  }

  const targetUserId = userData as string

  // Add them to the agency
  const { error } = await supabase.from("agency_members").upsert(
    {
      agency_id: agency.id,
      user_id: targetUserId,
      invited_by: caller.id,
      assigned_account_ids:
        accountIds.length > 0 ? accountIds : null,
    },
    { onConflict: "agency_id,user_id" }
  )

  if (error) throw new Error(error.message)

  // Update the invited user's role to 'user' if they have no role yet
  await supabase
    .from("profiles")
    .update({ role: "user" })
    .eq("id", targetUserId)
    .is("role", null)

  revalidatePath("/account")
}

/** Update which ad account IDs a member can access. */
export async function updateMemberAccountsAction(
  memberId: string,
  accountIds: string[]
) {
  const supabase = await createClient()
  const { data: { user: caller } } = await supabase.auth.getUser()
  if (!caller) throw new Error("Not authenticated")

  const { error } = await supabase
    .from("agency_members")
    .update({
      assigned_account_ids: accountIds.length > 0 ? accountIds : null,
    })
    .eq("id", memberId)

  if (error) throw new Error(error.message)
  revalidatePath("/account")
}

/** Remove a member from the agency. */
export async function removeMemberAction(memberId: string) {
  const supabase = await createClient()
  const { data: { user: caller } } = await supabase.auth.getUser()
  if (!caller) throw new Error("Not authenticated")

  const { error } = await supabase
    .from("agency_members")
    .delete()
    .eq("id", memberId)

  if (error) throw new Error(error.message)
  revalidatePath("/account")
}

/** Rename the agency. */
export async function renameAgencyAction(formData: FormData) {
  const name = (formData.get("name") as string)?.trim()
  if (!name) throw new Error("Name is required")

  const supabase = await createClient()
  const { data: { user: caller } } = await supabase.auth.getUser()
  if (!caller) throw new Error("Not authenticated")

  const { error } = await supabase
    .from("agencies")
    .update({ name })
    .eq("owner_id", caller.id)

  if (error) throw new Error(error.message)
  revalidatePath("/account")
}
