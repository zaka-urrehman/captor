"use client"

import { Loader2 } from "lucide-react"

interface ChatLoadingScreenProps {
    message?: string
}

export default function ChatLoadingScreen({
    message = "Loading your chat session..."
}: ChatLoadingScreenProps) {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
            <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto" />
                <div className="space-y-2">
                    <h2 className="text-xl font-medium text-white">Preparing Your Chat</h2>
                    <p className="text-gray-400">{message}</p>
                </div>
            </div>
        </div>
    )
}
