"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconInnerShadowTop,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import { NavMain } from "@/components/layout/nav-main"
import { NavSecondary } from "@/components/layout/nav-secondary"
import { NavUser } from "@/components/layout/nav-user"
import { AdminAgencySelector } from "@/components/layout/admin-agency-selector"
import type { Role } from "@/types"

interface Agency {
  id: string
  name: string
}

function SidebarEdgeTrigger() {
  const { toggleSidebar, open } = useSidebar()

  return (
    <button
      onClick={toggleSidebar}
      title={open ? "Collapse sidebar" : "Expand sidebar"}
      className="absolute -right-4 top-[72px] z-50 flex size-8 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-md transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    >
      {open ? (
        <IconChevronLeft className="size-4" />
      ) : (
        <IconChevronRight className="size-4" />
      )}
    </button>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<{
    name: string | null
    email: string | null
    image: string | null
  }>({ name: null, email: null, image: null })
  const [role, setRole] = useState<Role | null>(null)
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [currentAgencyId, setCurrentAgencyId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(async ({ data: { user: u } }) => {
      if (!u) return

      setUser({
        name: u.user_metadata?.full_name ?? u.user_metadata?.name ?? null,
        email: u.email ?? null,
        image: u.user_metadata?.avatar_url ?? null,
      })

      // Fetch the user's role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", u.id)
        .single()

      const userRole = (profile?.role as Role) ?? null
      setRole(userRole)

      // For admins, fetch all agencies and the current selected agency from cookie
      if (userRole === "admin") {
        const { data: allAgencies } = await supabase
          .from("agencies")
          .select("id, name")
          .order("name")
        setAgencies(allAgencies ?? [])

        // Read cookie value
        const match = document.cookie.match(/signal_admin_agency=([^;]+)/)
        setCurrentAgencyId(match ? match[1] : null)
      }
    })
  }, [])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarEdgeTrigger />
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold group-data-[collapsible=icon]:hidden">
                  Signal
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Admin-only: Agency Selector */}
        {role === "admin" && (
          <>
            <SidebarSeparator />
            <AdminAgencySelector
              agencies={agencies}
              currentAgencyId={currentAgencyId}
            />
          </>
        )}
      </SidebarHeader>

      <SidebarContent>
        <NavMain role={role} />
        <NavSecondary className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
