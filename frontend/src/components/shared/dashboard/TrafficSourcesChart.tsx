"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
    { name: "Website Embed", value: 45, color: "#8B5CF6" },
    { name: "Direct Link", value: 30, color: "#10B981" },
    { name: "API Integration", value: 15, color: "#F59E0B" },
    { name: "Other", value: 10, color: "#EF4444" },
]

export default function TrafficSourcesChart() {
    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-white">Conversation Traffic Sources</CardTitle>
                <p className="text-sm text-gray-400">Distribution by channel</p>
            </CardHeader>
            <CardContent>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={2} dataKey="value">
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                    {data.map((item) => (
                        <div key={item.name} className="flex items-center">
                            <div className="w-3 h-3 rounded mr-2" style={{ backgroundColor: item.color }}></div>
                            <span className="text-xs text-gray-400">{item.name}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
