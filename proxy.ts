import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isDashboardRoute =
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/outreach") ||
    req.nextUrl.pathname.startsWith("/ads") ||
    req.nextUrl.pathname.startsWith("/integrations") ||
    req.nextUrl.pathname.startsWith("/settings")

  if (isDashboardRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  if (req.nextUrl.pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
