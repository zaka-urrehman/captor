import { CheckCircle, FileText, AlertCircle, Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const activities = [
    {
        id: 1,
        type: "success",
        icon: CheckCircle,
        title: "Agent 'Customer Support' successfully deployed.",
        time: "2 hours ago",
        iconColor: "text-green-500",
    },
    {
        id: 2,
        type: "info",
        icon: FileText,
        title: "New document 'Product Manual V2' uploaded for all agents.",
        time: "5 hours ago",
        iconColor: "text-blue-500",
    },
    {
        id: 3,
        type: "warning",
        icon: AlertCircle,
        title: "Conversation #7890 with user 'Jane Doe' completed.",
        time: "Yesterday",
        iconColor: "text-purple-500",
    },
    {
        id: 4,
        type: "info",
        icon: Settings,
        title: "Schema 'Appointment Booking' updated with new fields.",
        time: "2 days ago",
        iconColor: "text-orange-500",
    },
    {
        id: 5,
        type: "error",
        icon: AlertCircle,
        title: "Integration with Google Docs failed. Please check credentials.",
        time: "3 days ago",
        iconColor: "text-red-500",
    },
]

export default function RecentActivity() {
    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Recent Activity</CardTitle>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    View All
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                            <div className={`mt-0.5 ${activity.iconColor}`}>
                                <activity.icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-white">{activity.title}</p>
                                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
