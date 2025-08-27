"use client"
import { Search, Bell, Settings } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import DashboardSidebar from "@/components/shared/dashboard/Sidebar"
import { Suspense, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            router.push("/login") // redirect if no token
        } else {
            setLoading(false) // render dashboard if token exists
        }
    }, [router])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                Loading...
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black">
            {/* Top Header */}
            <Suspense fallback={<div>Loading...</div>}>
                <header className="bg-black border-b border-gray-800 px-6 py-3">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <div className="text-purple-400 text-xl font-bold">✱ logo</div>
                        </div>

                        {/* Search and Actions */}
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search..."
                                    className="pl-10 w-80 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                                />
                            </div>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                                <Bell className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                                <Settings className="h-5 w-5" />
                            </Button>
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </header>
            </Suspense>

            <div className="flex">
                {/* Sidebar */}
                <DashboardSidebar />

                {/* Main Content */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
