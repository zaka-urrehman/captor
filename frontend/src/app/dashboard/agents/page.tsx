"use client"
import { useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import CreateAgentModal from "@/components/shared/dashboard/agent/CreateAgentModal"

const agents = [
    {
        id: 1,
        name: "Customer Support AI",
        status: "Active",
        lastModified: "2024-07-20",
        conversationsHandled: 1250,
    },
    {
        id: 2,
        name: "Sales Lead Qualifier",
        status: "Inactive",
        lastModified: "2024-07-18",
        conversationsHandled: 780,
    },
    {
        id: 3,
        name: "Onboarding Assistant",
        status: "Active",
        lastModified: "2024-07-15",
        conversationsHandled: 2300,
    },
    {
        id: 4,
        name: "Product Feedback Collector",
        status: "Draft",
        lastModified: "2024-07-10",
        conversationsHandled: 150,
    },
    {
        id: 5,
        name: "HR Inquiry Bot",
        status: "Active",
        lastModified: "2024-07-05",
        conversationsHandled: 950,
    },
]

function getStatusBadgeVariant(status: string) {
    switch (status) {
        case "Active":
            return "default"
        case "Inactive":
            return "secondary"
        case "Draft":
            return "outline"
        default:
            return "secondary"
    }
}

export default function AgentsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-200">Agents</h1>
                    <p className="text-gray-600 mt-1">Manage your AI conversational agents</p>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setIsModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Agent
                </Button>
            </div>

            {/* Agents Table */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
                {/* <div className="px-6 py-4 border-b border-gray-700">
                    <h2 className="text-lg font-medium text-white">Existing Agents</h2>
                </div> */}

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-750">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Agent Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Last Modified
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Conversations Handled
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {agents.map((agent) => (
                                <tr key={agent.id} className="hover:bg-gray-750">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-white">{agent.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge
                                            variant={getStatusBadgeVariant(agent.status)}
                                            className={
                                                agent.status === "Active"
                                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                                    : agent.status === "Draft"
                                                        ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                                                        : "bg-gray-600 hover:bg-gray-700 text-white"
                                            }
                                        >
                                            {agent.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{agent.lastModified}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {agent.conversationsHandled.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-gray-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <CreateAgentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    )
}
