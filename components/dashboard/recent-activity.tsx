import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Stage = "new_lead" | "contacted" | "qualified" | "opportunity" | "converted"

interface ActivityContact {
  id: string
  name: string
  source: string
  daysAgo: number
  stage: Stage
}

const STAGE_CONFIG: Record<Stage, { label: string; className: string }> = {
  new_lead:    { label: "New Lead",    className: "bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/10" },
  contacted:   { label: "Contacted",   className: "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/10" },
  qualified:   { label: "Qualified",   className: "bg-violet-500/10 text-violet-500 border-violet-500/20 hover:bg-violet-500/10" },
  opportunity: { label: "Opportunity", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10" },
  converted:   { label: "Converted",   className: "bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/10" },
}

const MOCK_ACTIVITY: ActivityContact[] = [
  { id: "1", name: "Maria Cruz",      source: "Meta Ads",   daysAgo: 15, stage: "contacted"   },
  { id: "2", name: "Vivian Torres",   source: "Meta Ads",   daysAgo: 16, stage: "contacted"   },
  { id: "3", name: "Adriana Acosta",  source: "Instagram",  daysAgo: 16, stage: "qualified"   },
  { id: "4", name: "Colleen Murphy",  source: "Referral",   daysAgo: 17, stage: "opportunity" },
  { id: "5", name: "Deborah Reyes",   source: "Meta Ads",   daysAgo: 17, stage: "new_lead"    },
  { id: "6", name: "Jennifer Salas",  source: "Meta Ads",   daysAgo: 17, stage: "contacted"   },
  { id: "7", name: "Anne Whitfield",  source: "Instagram",  daysAgo: 17, stage: "opportunity" },
  { id: "8", name: "Marlen Diaz",     source: "Meta Ads",   daysAgo: 17, stage: "contacted"   },
]

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <span className="text-base font-semibold">Recent Activity</span>
        <div className="flex items-center gap-3">
          <Link
            href="/outreach"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            Outreach
            <span className="text-xs">›</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-emerald-500">
            <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
            Live
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border">
          {MOCK_ACTIVITY.map((contact) => {
            const stage = STAGE_CONFIG[contact.stage]
            return (
              <li
                key={contact.id}
                className="flex items-center gap-3 px-6 py-3 hover:bg-muted/40 transition-colors"
              >
                {/* Avatar */}
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                  {getInitials(contact.name)}
                </div>

                {/* Name + source */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{contact.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {contact.source} &middot; {contact.daysAgo} days ago
                  </p>
                </div>

                {/* Stage badge */}
                <Badge variant="outline" className={`shrink-0 text-xs font-medium ${stage.className}`}>
                  {stage.label}
                </Badge>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
