"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

const spendData = [
  { date: "2025-01-01", spend: 24 },
  { date: "2025-01-03", spend: 31 },
  { date: "2025-01-05", spend: 18 },
  { date: "2025-01-07", spend: 42 },
  { date: "2025-01-10", spend: 37 },
  { date: "2025-01-13", spend: 29 },
  { date: "2025-01-16", spend: 55 },
  { date: "2025-01-19", spend: 48 },
  { date: "2025-01-22", spend: 33 },
  { date: "2025-01-25", spend: 60 },
  { date: "2025-01-28", spend: 44 },
  { date: "2025-01-31", spend: 51 },
  { date: "2025-02-03", spend: 39 },
  { date: "2025-02-06", spend: 67 },
  { date: "2025-02-09", spend: 28 },
  { date: "2025-02-12", spend: 74 },
  { date: "2025-02-15", spend: 58 },
  { date: "2025-02-18", spend: 45 },
  { date: "2025-02-21", spend: 82 },
  { date: "2025-02-24", spend: 63 },
  { date: "2025-02-27", spend: 71 },
  { date: "2025-03-02", spend: 49 },
  { date: "2025-03-05", spend: 88 },
  { date: "2025-03-08", spend: 76 },
  { date: "2025-03-11", spend: 91 },
  { date: "2025-03-13", spend: 84 },
]

const chartConfig = {
  spend: {
    label: "Ad Spend",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function SpendChart() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) setTimeRange("7d")
  }, [isMobile])

  const filteredData = spendData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2025-03-13")
    let daysToSubtract = 90
    if (timeRange === "30d") daysToSubtract = 30
    else if (timeRange === "7d") daysToSubtract = 7
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Ad Spend</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total spend for the selected period
          </span>
          <span className="@[540px]/card:hidden">Spend trend</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select time range"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">Last 3 months</SelectItem>
              <SelectItem value="30d" className="rounded-lg">Last 30 days</SelectItem>
              <SelectItem value="7d" className="rounded-lg">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillSpend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-spend)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-spend)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  formatter={(value) => [`$${value}`, "Spend"]}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="spend"
              type="natural"
              fill="url(#fillSpend)"
              stroke="var(--color-spend)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
