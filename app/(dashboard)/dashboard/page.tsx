import { auth } from "@/lib/auth"
import { SectionCards } from "@/components/dashboard/section-cards"
import { PipelineOverview } from "@/components/dashboard/pipeline-overview"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { ProposalsList } from "@/components/dashboard/proposals-list"

function formatHeaderDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

export default async function DashboardPage() {
  const session = await auth()
  const userName = session?.user?.name ?? "Welcome"
  const today = formatHeaderDate(new Date())

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Page header */}
      <div className="px-4 lg:px-6">
        <p className="text-sm text-muted-foreground">{today}</p>
        <h1 className="text-2xl font-bold tracking-tight">{userName}</h1>
      </div>

      {/* KPI cards */}
      <SectionCards />

      {/* Two-column: main content + sidebar */}
      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 lg:px-6 md:gap-6">
        {/* Left 2/3 */}
        <div className="flex flex-col gap-4 lg:col-span-2 md:gap-6">
          <PipelineOverview />
          <RecentActivity />
        </div>

        {/* Right 1/3 */}
        <div className="lg:col-span-1">
          <DashboardSidebar />
        </div>
      </div>

      {/* Proposals */}
      <div className="px-4 lg:px-6">
        <ProposalsList />
      </div>
    </div>
  )
}
