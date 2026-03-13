"use client"

import Link from "next/link"
import { IconUsers, IconSend, IconPlugConnected, IconChevronRight } from "@tabler/icons-react"
import { Card, CardContent } from "@/components/ui/card"

const QUICK_LINKS = [
  {
    href: "/crm",
    icon: IconUsers,
    label: "CRM Pipeline",
    description: "View all contacts & stages",
    iconClassName: "text-blue-500 bg-blue-500/10",
  },
  {
    href: "/outreach",
    icon: IconSend,
    label: "Outreach",
    description: "Email & SMS your leads",
    iconClassName: "text-emerald-500 bg-emerald-500/10",
  },
  {
    href: "/integrations",
    icon: IconPlugConnected,
    label: "Integrations",
    description: "Connect apps & tools",
    iconClassName: "text-amber-500 bg-amber-500/10",
  },
]

export function DashboardSidebar() {
  return (
    <div className="flex flex-col gap-4">
      {/* CTR */}
      <Card>
        <CardContent className="pt-5 pb-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">CTR</p>
          <p className="mt-1 text-4xl font-bold tracking-tight">3.52%</p>
        </CardContent>
      </Card>

      {/* CPM */}
      <Card>
        <CardContent className="pt-5 pb-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">CPM</p>
          <p className="mt-1 text-4xl font-bold tracking-tight">$21</p>
        </CardContent>
      </Card>

      {/* Quick links */}
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {QUICK_LINKS.map(({ href, icon: Icon, label, description, iconClassName }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/40 transition-colors"
                >
                  <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                  <IconChevronRight size={14} className="text-muted-foreground shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
