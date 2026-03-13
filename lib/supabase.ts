import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * Browser-side Supabase client for use in Client Components.
 * Uses the anon key and respects Row Level Security (RLS).
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Creates a server-side Supabase client with the service role key.
 * Use in Server Components, Route Handlers, and Server Actions.
 * Bypasses RLS — use only where elevated privileges are required.
 */
export function createServerClient() {
  return createClient(supabaseUrl, supabaseServiceRoleKey)
}
