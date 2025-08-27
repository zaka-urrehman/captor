"use client"

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
    { month: "Feb", rate: 75 },
    { month: "Mar", rate: 78 },
    { month: "Apr", rate: 82 },
    { month: "May", rate: 85 },
    { month: "Jun", rate: 88 },
]

export default function ConversationCompletionChart() {
    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-white">Conversation Completion Rate</CardTitle>
                <p className="text-sm text-gray-400">Last 6 Months</p>
            </CardHeader>
            <CardContent>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                domain={[0, 100]}
                                tickFormatter={(value) => `${value}%`}
                            />
                            <Line
                                type="monotone"
                                dataKey="rate"
                                stroke="#8B5CF6"
                                strokeWidth={2}
                                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
