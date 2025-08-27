"use client"

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
    { name: "SalesBot", conversations: 120, completed: 95 },
    { name: "SupportBot", conversations: 180, completed: 145 },
    { name: "HRBot", conversations: 60, completed: 45 },
]

export default function AgentPerformanceChart() {
    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-white">Agent Performance Overview</CardTitle>
                <p className="text-sm text-gray-400">Conversations vs. Completion</p>
            </CardHeader>
            <CardContent>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="horizontal">
                            <XAxis
                                type="number"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            />
                            <YAxis
                                type="category"
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                width={80}
                            />
                            <Bar dataKey="conversations" fill="#10B981" radius={[0, 4, 4, 0]} />
                            <Bar dataKey="completed" fill="#F59E0B" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center space-x-6 mt-4">
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                        <span className="text-sm text-gray-400">Conversations</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
                        <span className="text-sm text-gray-400">Completed</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
