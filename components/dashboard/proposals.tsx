import type { Proposal } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ProposalsProps {
  proposals: Proposal[]
}

const STATUS_STYLES: Record<
  Proposal["status"],
  { label: string; className: string }
> = {
  draft:    { label: "Draft",    className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
  sent:     { label: "Sent",     className: "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-400" },
  accepted: { label: "Accepted", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-400" },
}

export function Proposals({ proposals }: ProposalsProps) {
  const total    = proposals.length
  const sent     = proposals.filter((p) => p.status === "sent").length
  const accepted = proposals.filter((p) => p.status === "accepted").length

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Proposals</h3>
          <p className="text-xs text-muted-foreground">
            {total} total · {sent} sent · {accepted} accepted
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Plus className="size-3.5" />
          New
        </Button>
      </div>
      <ul className="divide-y divide-border -mx-4">
        {proposals.length === 0 ? (
          <li className="px-4 py-6 text-center text-sm text-muted-foreground">
            No proposals yet
          </li>
        ) : (
          proposals.map((proposal) => {
            const statusStyle = STATUS_STYLES[proposal.status]
            return (
              <li
                key={proposal.id}
                className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-muted/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{proposal.title}</p>
                  {proposal.client_name && (
                    <p className="text-xs text-muted-foreground">{proposal.client_name}</p>
                  )}
                </div>
                <Badge
                  variant="secondary"
                  className={cn("ml-3 shrink-0 border-0 font-normal text-xs", statusStyle.className)}
                >
                  {statusStyle.label}
                </Badge>
              </li>
            )
          })
        )}
      </ul>
    </div>
  )
}
