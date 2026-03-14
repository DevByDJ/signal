import { type NextRequest, NextResponse } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/crm",
  "/outreach",
  "/ads",
  "/social",
  "/integrations",
  "/settings",
  "/account",
]

// Routes only accessible by agency_admin or admin roles
const AGENCY_ADMIN_PREFIXES = ["/account"]

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user, role } = await updateSession(request)
  const { pathname } = request.nextUrl

  // Redirect root to login (or dashboard if already authenticated)
  if (pathname === "/") {
    const url = request.nextUrl.clone()
    url.pathname = user ? "/dashboard" : "/login"
    return NextResponse.redirect(url)
  }

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))

  // Unauthenticated users get sent to login for any protected route
  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // Authenticated users with no role set must complete onboarding first
  if (user && role === null && pathname !== "/onboarding") {
    const url = request.nextUrl.clone()
    url.pathname = "/onboarding"
    return NextResponse.redirect(url)
  }

  // /account is only for agency_admin and admin
  const isAgencyAdminRoute = AGENCY_ADMIN_PREFIXES.some((p) =>
    pathname.startsWith(p)
  )
  if (isAgencyAdminRoute && role !== "agency_admin" && role !== "admin") {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  // Logged-in users don't need to see the login page
  if (pathname === "/login" && user) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
