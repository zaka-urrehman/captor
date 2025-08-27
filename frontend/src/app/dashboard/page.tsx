import MetricCards from "@/components/shared/dashboard/MetricCards"
import ConversationCompletionChart from "@/components/shared/dashboard/ConversationCompletionChart"
import AgentPerformanceChart from "@/components/shared/dashboard/AgentPerformanceChart"
import RecentActivity from "@/components/shared/dashboard/RecentActivity"
import TrafficSourcesChart from "@/components/shared/dashboard/TrafficSourcesChart"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <MetricCards />

      {/* Charts and Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversation Completion Rate */}
        <div className="lg:col-span-1">
          <ConversationCompletionChart />
        </div>

        {/* Agent Performance Overview */}
        <div className="lg:col-span-1">
          <AgentPerformanceChart />
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Sources */}
        <div className="lg:col-span-1">
          <TrafficSourcesChart />
        </div>
        
        {/* Empty space for future widgets */}
        <div className="lg:col-span-2"></div>
      </div>
    </div>
  )
}
