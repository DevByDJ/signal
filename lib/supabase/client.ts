import { createBrowserClient } from "@supabase/ssr"

/**
 * Browser-side Supabase client for use in Client Components.
 * Call once per render — memoisation is handled internally by @supabase/ssr.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
