"use client"

import Link from "next/link"
import { LayoutDashboard, Users, Share2, MessageSquare, Database, FileText, Puzzle, BarChart3, Settings, HelpCircle } from 'lucide-react'
import { cn } from "@/lib/utils"

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, current: true },
    { name: "Agents", href: "/dashboard/agents", icon: Users, current: false },
    { name: "Share Link Management", href: "/dashboard/share-links", icon: Share2, current: false },
    { name: "Conversations", href: "/dashboard/conversations", icon: MessageSquare, current: false },
    { name: "Schemas", href: "/dashboard/schemas", icon: Database, current: false },
    { name: "Documents", href: "/dashboard/documents", icon: FileText, current: false },
    { name: "Integrations", href: "/dashboard/integrations", icon: Puzzle, current: false },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, current: false },
    { name: "Settings", href: "/dashboard/settings", icon: Settings, current: false },
    { name: "Help", href: "/dashboard/help", icon: HelpCircle, current: false },
]

export default function DashboardSidebar() {
    return (
        <div className="w-64 bg-black border-r border-gray-200 min-h-screen">
            <nav className="mt-6 px-3">
                <ul className="space-y-1">
                    {navigation.map((item) => (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                className={cn(
                                    item.current
                                        ? "bg-gray-900 text-white"
                                        : "text-gray-600 hover:bg-gray-300 hover:text-gray-900",
                                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md duration-300"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        item.current ? "text-white" : "text-gray-400 group-hover:text-gray-500",
                                        "mr-3 h-5 w-5"
                                    )}
                                />
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
}
