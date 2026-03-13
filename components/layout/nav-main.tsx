"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconLayoutDashboard,
  IconUsers,
  IconSend,
  IconSpeakerphone,
  IconShare,
} from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navItems = [
  { title: "Dashboard",  href: "/dashboard",  icon: IconLayoutDashboard },
  { title: "CRM",        href: "/crm",         icon: IconUsers },
  { title: "Outreach",   href: "/outreach",    icon: IconSend },
  { title: "Ads",        href: "/ads",         icon: IconSpeakerphone },
  { title: "Social",     href: "/social",      icon: IconShare },
]

export function NavMain() {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {navItems.map((item) => (
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
