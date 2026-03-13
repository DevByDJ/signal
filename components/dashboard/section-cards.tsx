import {
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {/* Total Spend */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Spend</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $871
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +5 active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Across all campaigns <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">0 active campaigns</div>
        </CardFooter>
      </Card>

      {/* Leads */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Leads</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            20
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +3 converted
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            3 converted this period <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">From all ad sources</div>
        </CardFooter>
      </Card>

      {/* Cost Per Lead */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Cost Per Lead</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $44
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              Target $45
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            $1 below target <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">On track this month</div>
        </CardFooter>
      </Card>

      {/* ROAS */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>ROAS</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            33.87x
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +2.1x
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Target 4x exceeded <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Strong return on ad spend</div>
        </CardFooter>
      </Card>
    </div>
  )
}
