import { TrendingUp, TrendingDown, Users, MessageSquare, FileText, Database } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const metrics = [
    {
        title: "Total Agents",
        value: "12",
        change: "+15%",
        trend: "up",
        icon: Users,
    },
    {
        title: "Active Conversations",
        value: "235",
        change: "+8%",
        trend: "up",
        icon: MessageSquare,
    },
    {
        title: "Documents Processed",
        value: "1,280",
        change: "+20%",
        trend: "up",
        icon: FileText,
    },
    {
        title: "Schema Updates",
        value: "7",
        change: "-5%",
        trend: "down",
        icon: Database,
    },
]

export default function MetricCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric) => (
                <Card key={metric.title} className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300">
                            {metric.title}
                        </CardTitle>
                        <metric.icon className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{metric.value}</div>
                        <div className="flex items-center text-xs">
                            {metric.trend === "up" ? (
                                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            ) : (
                                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                            )}
                            <span
                                className={
                                    metric.trend === "up" ? "text-green-500" : "text-red-500"
                                }
                            >
                                {metric.change}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
