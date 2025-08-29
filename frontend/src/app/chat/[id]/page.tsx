"use client"

import { useState, useRef, useEffect, use } from "react"
import { Send, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import ChatLoginModal from "@/components/shared/ChatLoginModal"
import ChatLoadingScreen from "@/components/shared/ChatLoadingScreen"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { agentsAPI } from "@/lib/api"
import type { CreateSessionRequest } from "@/types/agents"
import {
    setSessionData,
    setLoading,
    setError,
    addMessage,
    initializeStore
} from "@/store/slices/chatSlice"

interface Message {
    id: string
    content: string
    sender: "ai" | "user"
    timestamp: Date
}

interface ChatPageProps {
    params: Promise<{
        id: string
    }>
}

export default function ChatPage({ params }: ChatPageProps) {
    const resolvedParams = use(params)
    const agentId = parseInt(resolvedParams.id)

    // Local state
    const [showLoginModal, setShowLoginModal] = useState(true)
    const [loginError, setLoginError] = useState<string | null>(null)
    const [inputMessage, setInputMessage] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Redux hooks
    const dispatch = useDispatch<AppDispatch>()
    const {
        sessionData,
        messages,
        isLoading,
        error
    } = useSelector((state: RootState) => state.chat)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
        // Initialize store for Redux DevTools
        console.log('Initializing Chat Store for Redux DevTools...')
        dispatch(initializeStore())
        console.log('Chat Store initialized successfully')
    }, [messages, dispatch])

    // Convert API messages to local format
    const formattedMessages: Message[] = messages.map(msg => ({
        id: msg.id.toString(),
        content: msg.content,
        sender: msg.sender === "ai" ? "ai" : "user",
        timestamp: new Date(msg.created_at)
    }))

    const handleLogin = async (name: string, email: string) => {
        try {
            setLoginError(null)
            dispatch(setLoading(true))

            const requestData: CreateSessionRequest = {
                agent_id: agentId,
                customer_name: name,
                customer_email: email
            }

            const response = await agentsAPI.getOrCreateSession(requestData)

            // Store the session data in Redux
            dispatch(setSessionData(response))
            setShowLoginModal(false)
        } catch (err) {
            console.error("Error creating chat session:", err)
            setLoginError("Failed to start chat session. Please try again.")
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleSendMessage = () => {
        if (!inputMessage.trim()) return

        const newMessage: Message = {
            id: Date.now().toString(),
            content: inputMessage,
            sender: "user",
            timestamp: new Date(),
        }

        // Add to Redux store (you might want to send to API as well)
        dispatch(addMessage({
            id: parseInt(newMessage.id),
            sender: "user",
            receiver: "ai",
            content: newMessage.content,
            session_id: sessionData?.session?.id || 0,
            created_at: newMessage.timestamp.toISOString()
        }))

        setInputMessage("")

        // Simulate AI response after a short delay
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                content: "Thank you for that information. Let me process your response and continue...",
                sender: "ai",
                timestamp: new Date(),
            }

            dispatch(addMessage({
                id: parseInt(aiResponse.id),
                sender: "ai",
                receiver: "user",
                content: aiResponse.content,
                session_id: sessionData?.session?.id || 0,
                created_at: aiResponse.timestamp.toISOString()
            }))
        }, 1000)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    // Show loading screen while creating session
    if (isLoading) {
        return <ChatLoadingScreen />
    }

    // Show login modal if user hasn't logged in yet
    if (showLoginModal) {
        return (
            <ChatLoginModal
                isOpen={showLoginModal}
                onSubmit={handleLogin}
                isLoading={isLoading}
                error={loginError}
            />
        )
    }

    // Main chat interface
    return (
        <div className="flex flex-col h-screen bg-gray-900">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-white text-lg font-medium">
                            {sessionData?.customer?.name ? `Chat with ${sessionData.customer.name}` : "AI Chat Assistant"}
                        </h1>
                        {sessionData?.is_new_session && (
                            <p className="text-gray-400 text-sm">Welcome! This is your first chat session.</p>
                        )}
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <Info className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {formattedMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-medium text-white">Welcome to your chat session!</h3>
                            <p className="text-gray-400">Start the conversation by typing a message below.</p>
                        </div>
                    </div>
                ) : (
                    formattedMessages.map((message) => (
                        <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                                    message.sender === "user"
                                        ? "bg-purple-600 text-white"
                                        : "bg-gray-700 text-gray-100"
                                }`}
                            >
                                <p className="text-sm">{message.content}</p>
                                <p className="text-xs opacity-70 mt-1">
                                    {message.timestamp.toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-900 border-l-4 border-red-500 p-4 mx-4 mb-2">
                    <p className="text-red-200 text-sm">{error}</p>
                </div>
            )}

            {/* Redux DevTools Test Button - Remove in production
            {process.env.NODE_ENV === 'development' && (
                <div className="bg-yellow-900 border-l-4 border-yellow-500 p-4 mx-4 mb-2">
                    <p className="text-yellow-200 text-sm mb-2">Redux DevTools Test:</p>
                    <button
                        onClick={() => {
                            console.log('Testing Redux DevTools...')
                            dispatch(addMessage({
                                id: Date.now(),
                                sender: 'user',
                                receiver: 'ai',
                                content: 'Test message for Redux DevTools',
                                session_id: sessionData?.session?.id || 0,
                                created_at: new Date().toISOString()
                            }))
                        }}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                    >
                        Test Redux DevTools
                    </button>
                </div>
            )} */}

            {/* Message Input */}
            <div className="bg-gray-800 border-t border-gray-700 p-4">
                <div className="flex items-center space-x-2">
                    <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                    />
                    <Button
                        onClick={handleSendMessage}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        disabled={!inputMessage.trim()}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
