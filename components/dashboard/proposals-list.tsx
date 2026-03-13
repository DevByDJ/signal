"use client"

import { IconFileText, IconPlus } from "@tabler/icons-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type ProposalStatus = "draft" | "sent" | "accepted" | "declined"

interface Proposal {
  id: string
  title: string
  client: string
  status: ProposalStatus
}

const STATUS_CONFIG: Record<ProposalStatus, { label: string; className: string }> = {
  draft:    { label: "Draft",    className: "bg-muted text-muted-foreground border-border hover:bg-muted" },
  sent:     { label: "Sent",     className: "bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/10" },
  accepted: { label: "Accepted", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10" },
  declined: { label: "Declined", className: "bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/10" },
}

const MOCK_PROPOSALS: Proposal[] = [
  { id: "1", title: "Content Production Packages", client: "Shank It Golf",   status: "draft" },
  { id: "2", title: "Growth Catalyst MM",          client: "MAG Media",       status: "draft" },
]

export function ProposalsList() {
  const total    = MOCK_PROPOSALS.length
  const sent     = MOCK_PROPOSALS.filter((p) => p.status === "sent").length
  const accepted = MOCK_PROPOSALS.filter((p) => p.status === "accepted").length

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div>
          <span className="text-base font-semibold">Proposals</span>
          <p className="text-xs text-muted-foreground mt-0.5">
            {total} total &middot; {sent} sent &middot; {accepted} accepted
          </p>
        </div>
        <Button size="sm" className="gap-1.5">
          <IconPlus size={14} />
          New
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border">
          {MOCK_PROPOSALS.map((proposal) => {
            const status = STATUS_CONFIG[proposal.status]
            return (
              <li
                key={proposal.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition-colors cursor-pointer"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <IconFileText size={16} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{proposal.title}</p>
                  <p className="text-xs text-muted-foreground">{proposal.client}</p>
                </div>
                <Badge variant="outline" className={`shrink-0 text-xs ${status.className}`}>
                  <IconFileText size={11} className="mr-1" />
                  {status.label}
                </Badge>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
