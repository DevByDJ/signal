import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const STAGES = [
  { key: "new_lead",    label: "New Lead",   color: "bg-blue-500",   dot: "bg-blue-500",   count: 4 },
  { key: "contacted",  label: "Contacted",  color: "bg-amber-400",  dot: "bg-amber-400",  count: 4 },
  { key: "qualified",  label: "Qualified",  color: "bg-violet-500", dot: "bg-violet-500", count: 5 },
  { key: "opportunity",label: "Opportunity",color: "bg-emerald-500",dot: "bg-emerald-500",count: 3 },
  { key: "converted",  label: "Converted",  color: "bg-rose-500",   dot: "bg-rose-500",   count: 3 },
]

export function PipelineOverview() {
  const total = STAGES.reduce((sum, s) => sum + s.count, 0)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <span className="text-base font-semibold">Pipeline Overview</span>
        <Link
          href="/crm"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          View Board
          <span className="text-xs">›</span>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Segmented bar */}
        <div className="flex h-2.5 w-full overflow-hidden rounded-full gap-0.5">
          {STAGES.map((stage) => (
            <div
              key={stage.key}
              className={`${stage.color} rounded-full`}
              style={{ width: `${(stage.count / total) * 100}%` }}
            />
          ))}
        </div>

        {/* Stage counts */}
        <div className="grid grid-cols-3 gap-x-4 gap-y-3">
          {STAGES.map((stage) => (
            <div key={stage.key} className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <span className={`size-2 rounded-full ${stage.dot}`} />
                <span className="text-xs text-muted-foreground">{stage.label}</span>
              </div>
              <span className="text-xl font-bold pl-3.5">{stage.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
