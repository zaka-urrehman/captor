"use client"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { chatAPI } from "@/lib/api"
import type { ConversationListItem, ConversationsResponse, SessionDetailsResponse } from "@/types/general"

function formatDate(dateStr: string | null | undefined) {
    if (!dateStr) return "-"
    try {
        const d = new Date(dateStr)
        return d.toLocaleDateString()
    } catch {
        return dateStr as string
    }
}

function parseMessageContent(raw: string): string {
    if (typeof raw !== "string") return ""
    if (raw.startsWith("{")) {
        try {
            const parsed = JSON.parse(raw)
            return parsed?.content ?? raw
        } catch {
            return raw
        }
    }
    return raw
}

export default function ConversationsPage() {
    const [list, setList] = useState<ConversationListItem[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [details, setDetails] = useState<SessionDetailsResponse | null>(null)
    const selectedConversation = useMemo(() => list.find(c => c.id === selectedId) || null, [list, selectedId])

    useEffect(() => {
        const run = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const resp: ConversationsResponse = await chatAPI.getConversations()
                const conversations = resp.conversations || []
                setList(conversations)
                if (conversations.length > 0) {
                    setSelectedId(conversations[0].id)
                }
            } catch (e: any) {
                setError(e?.message || "Failed to load conversations")
            } finally {
                setIsLoading(false)
            }
        }
        run()
    }, [])

    useEffect(() => {
        const loadDetails = async () => {
            if (!selectedId) return
            try {
                const resp = await chatAPI.getSessionDetails(selectedId)
                setDetails(resp)
            } catch (e) {
                console.error(e)
            }
        }
        loadDetails()
    }, [selectedId])

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-screen overflow-y-scroll">
            {/* Left Panel - Conversations List */}
            <Card className="bg-gray-800 border-gray-700 flex flex-col h-full">
                <CardHeader>
                    <CardTitle className="text-white">Conversations List</CardTitle>
                    <p className="text-gray-400 text-sm">Recent AI intake conversations</p>
                </CardHeader>
                <CardContent className="p-0 flex-1 flex flex-col">
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-700 text-sm font-medium text-gray-300">
                            <div className="col-span-3">Agent</div>
                            <div className="col-span-3">Customer</div>
                            <div className="col-span-3">Email</div>
                            <div className="col-span-2">Date</div>
                            <div className="col-span-1">Status</div>
                        </div>

                        {/* Conversation Rows */}
                        <div className="flex-1 overflow-y-auto">
                            {isLoading && (
                                <div className="px-6 py-4 text-gray-400 text-sm">Loading conversations...</div>
                            )}
                            {error && (
                                <div className="px-6 py-4 text-red-400 text-sm">{error}</div>
                            )}
                            {list.map((conversation) => (
                                <div
                                    key={conversation.id}
                                    className={`grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer transition-colors ${selectedId === conversation.id ? "bg-gray-700" : ""
                                        }`}
                                    onClick={() => setSelectedId(conversation.id)}
                                >
                                    <div className="col-span-3 text-white text-sm">{conversation.agent_name}</div>
                                    <div className="col-span-3 text-gray-300 text-sm">{conversation.customer_name}</div>
                                    <div className="col-span-3 text-gray-400 text-sm truncate">{conversation.customer_email}</div>
                                    <div className="col-span-2 text-gray-400 text-sm">{formatDate(conversation.started_at)}</div>
                                    <div className="col-span-1">
                                        <span
                                            className={`inline-flex px-2 py-1  rounded-full text-xs font-medium ${conversation.session_closed
                                                    ? "bg-blue-600 text-white"
                                                    : conversation.ended_at
                                                        ? "bg-green-600 text-white"
                                                        : "bg-yellow-600 text-white"
                                                }`}
                                        >
                                            {conversation.session_closed ? "Completed" : conversation.ended_at ? "Ended" : "Ongoing"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {(!isLoading && !error && list.length === 0) && (
                                <div className="px-6 py-4 text-gray-400 text-sm">No conversations found.</div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Right Panel - Conversation Details */}
            <Card className="bg-gray-800 border-gray-700 flex flex-col h-full">
                <CardHeader>
                    <CardTitle className="text-white">Conversation Details</CardTitle>
                    <p className="text-gray-400 text-sm">
                        {selectedConversation ? `Transcript for "${selectedConversation.customer_name}"` : "Select a conversation"}
                    </p>
                </CardHeader>
                <CardContent className="space-y-6 flex-1 flex flex-col">
                    {/* Transcript Section */}
                    <div className="flex-1 flex flex-col">
                        <h3 className="text-lg font-semibold text-white mb-4">Transcript</h3>
                        <div className="space-y-4 flex-1 overflow-y-auto">
                            {details?.messages?.map((message) => {
                                const isAssistant = message.sender === "Assistant"
                                const content = parseMessageContent(message.content)
                                const timeStr = new Date(message.created_at).toLocaleTimeString()
                                return (
                                    <div key={message.id} className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
                                        <div
                                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isAssistant ? "bg-gray-700 text-gray-200" : "bg-purple-600 text-white"
                                                }`}
                                        >
                                            <p className="text-sm">{content}</p>
                                            <p className="text-xs opacity-70 mt-1">{timeStr}</p>
                                        </div>
                                    </div>
                                )
                            })}
                            {!details?.messages?.length && (
                                <div className="text-gray-400 text-sm">No messages for this conversation.</div>
                            )}
                        </div>
                    </div>

                    {/* Extracted Data Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Extracted Data</h3>
                        <div className="space-y-2">
                            {details?.collected_data?.map((cd) => (
                                <div key={cd.id} className="grid grid-cols-12 gap-4 text-sm">
                                    <div className="col-span-4 text-gray-400">Field #{cd.field_id}</div>
                                    <div className="col-span-8 text-white">{cd.answer}</div>
                                </div>
                            ))}
                            {!details?.collected_data?.length && (
                                <div className="text-gray-400 text-sm">No extracted data available.</div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
