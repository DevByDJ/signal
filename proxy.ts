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
]

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)
  const { pathname } = request.nextUrl

  // Redirect root to login (or dashboard if already authenticated)
  if (pathname === "/") {
    const url = request.nextUrl.clone()
    url.pathname = user ? "/dashboard" : "/login"
    return NextResponse.redirect(url)
  }

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))

  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

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
