"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconLayoutDashboard,
  IconUsers,
  IconSend,
  IconSpeakerphone,
  IconShare,
  IconBuilding,
} from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { Role } from "@/types"

const baseNavItems = [
  { title: "Dashboard", href: "/dashboard", icon: IconLayoutDashboard },
  { title: "CRM",       href: "/crm",       icon: IconUsers },
  { title: "Outreach",  href: "/outreach",  icon: IconSend },
  { title: "Ads",       href: "/ads",       icon: IconSpeakerphone },
  { title: "Social",    href: "/social",    icon: IconShare },
]

const agencyAdminItems = [
  { title: "Account", href: "/account", icon: IconBuilding },
]

interface NavMainProps {
  role?: Role | null
}

export function NavMain({ role }: NavMainProps) {
  const pathname = usePathname()
  const items = [
    ...baseNavItems,
    ...(role === "agency_admin" || role === "admin" ? agencyAdminItems : []),
  ]

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
                tooltip={item.title}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
