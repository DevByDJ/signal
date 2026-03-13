import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface MetricCardProps {
  title: string
  value: string
  subtitle?: string
  icon?: React.ReactNode
  highlighted?: boolean
  trend?: { value: string; positive: boolean }
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  highlighted = false,
  trend,
}: MetricCardProps) {
  return (
    <Card
      className={cn(
        highlighted &&
          "bg-foreground text-background ring-foreground/20 [&_.text-muted-foreground]:text-background/80"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <span
          className={cn(
            "text-sm font-medium",
            highlighted ? "text-background/80" : "text-muted-foreground"
          )}
        >
          {title}
        </span>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">{value}</span>
          {trend && (
            <span
              className={cn(
                "text-sm font-medium",
                trend.positive ? "text-emerald-600" : "text-red-600",
                highlighted && trend.positive && "text-emerald-400",
                highlighted && !trend.positive && "text-red-400"
              )}
            >
              {trend.value}
            </span>
          )}
        </div>
        {subtitle && (
          <p
            className={cn(
              "mt-1 text-xs",
              highlighted ? "text-background/80" : "text-muted-foreground"
            )}
          >
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
