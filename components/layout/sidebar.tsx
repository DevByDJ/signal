"use client"

import * as React from "react"
import Link from "next/link"
import { IconInnerShadowTop, IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
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
  useSidebar,
} from "@/components/ui/sidebar"
import { NavMain } from "@/components/layout/nav-main"
import { NavSecondary } from "@/components/layout/nav-secondary"
import { NavUser } from "@/components/layout/nav-user"

function SidebarEdgeTrigger() {
  const { toggleSidebar, open } = useSidebar()

  return (
    <button
      onClick={toggleSidebar}
      title={open ? "Collapse sidebar" : "Expand sidebar"}
      className="absolute -right-4 top-[72px] z-50 flex size-8 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-md transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    >
      {open
        ? <IconChevronLeft className="size-4" />
        : <IconChevronRight className="size-4" />
      }
    </button>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<{ name: string | null; email: string | null; image: string | null }>({
    name: null,
    email: null,
    image: null,
  })

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (u) {
        setUser({
          name: u.user_metadata?.full_name ?? u.user_metadata?.name ?? null,
          email: u.email ?? null,
          image: u.user_metadata?.avatar_url ?? null,
        })
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
                <span className="text-base font-semibold group-data-[collapsible=icon]:hidden">Signal</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavSecondary className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
