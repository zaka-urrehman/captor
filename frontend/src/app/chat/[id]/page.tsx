"use client"

import { useState, useRef, useEffect, useCallback, use } from "react"
import { Send, Info } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import ChatLoginModal from "@/components/shared/ChatLoginModal"
import ChatLoadingScreen from "@/components/shared/ChatLoadingScreen"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { agentsAPI } from "@/lib/api"
import type { CreateSessionRequest } from "@/types/agents"
import type { WebhookResponse } from "@/types/general"
import {
    setSessionData,
    setLoading,
    setAgentData,
    addMessage,
    appendCollectedData,
    updateSessionClosed,
    initializeStore
} from "@/store/slices/chatSlice"

interface Message {
    id: string
    content: string
    sender: "assistant" | "user"
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
    const [firstMessageInitialized, setFirstMessageInitialized] = useState(false)
    const [showSessionClosedMessage, setShowSessionClosedMessage] = useState(false)
    const [showTyping, setShowTyping] = useState(false)
    const [isAIResponseLoading, setIsAIResponseLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const isLoadingRef = useRef(false)

    // Redux hooks
    const dispatch = useDispatch<AppDispatch>()
    const {
        sessionData,
        agent,
        isLoading,
        error
    } = useSelector((state: RootState) => state.chat)

    // Get messages from sessionData
    const messages = sessionData?.messages || []

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    // Function to manage typing indicator with random durations
    const manageTypingIndicator = useCallback(() => {
        const showTypingForRandomDuration = () => {
            // Random duration between 0.5 and 2 seconds
            const randomDuration = Math.random() * 1500 + 500 // 500ms to 2000ms

            setShowTyping(true)

            setTimeout(() => {
                setShowTyping(false)

                // Random delay before showing typing again (between 0.3 and 1 second)
                const randomDelay = Math.random() * 700 + 300 // 300ms to 1000ms

                setTimeout(() => {
                    // Only continue if we're still loading (webhook hasn't responded yet)
                    if (isLoadingRef.current) {
                        showTypingForRandomDuration()
                    }
                }, randomDelay)
            }, randomDuration)
        }

        showTypingForRandomDuration()
    }, [])

    const fetchAgentDetails = useCallback(async () => {
        try {
            const response = await agentsAPI.getAgent(agentId)
            if (response.success && response.data) {
                // Exclude chat_sessions from the agent data as requested
                const { chat_sessions, ...agentData } = response.data
                dispatch(setAgentData(agentData))
            } else {
                console.error("Failed to fetch agent details:", response.message)
                setLoginError("Agent not found or unavailable.")
            }
        } catch (err) {
            console.error("Error fetching agent details:", err)
            setLoginError("Failed to load agent information.")
        }
    }, [agentId, dispatch, setLoginError])

    const initializeFirstMessage = useCallback(async (customerName: string) => {
        try {
            const messageData = {
                sender: "Assistant",
                receiver: "User",
                session_id: sessionData?.session?.id || 0,
                content: JSON.stringify({
                    role: "Assistant",
                    content: `Hello ${customerName}, how are you doing today?`
                })
            }

            const response: any = await agentsAPI.appendFirstMessage(messageData)

            // Parse the response content if it's a JSON string
            let messageContent = `Hello ${customerName}, how are you doing today?`
            if (response.content && typeof response.content === 'string' && response.content.startsWith('{')) {
                try {
                    const parsedContent = JSON.parse(response.content)
                    messageContent = parsedContent.content || messageContent
                } catch (parseError) {
                    console.warn('Failed to parse first message content:', parseError)
                }
            }

            // Add the message to Redux with the backend response data
            const aiMessage = {
                id: response.id,
                sender: "Assistant",
                receiver: "User",
                content: messageContent,
                session_id: sessionData?.session?.id || 0,
                created_at: response.created_at
            }

            dispatch(addMessage(aiMessage))
        } catch (err) {
            console.error("Error initializing first message:", err)
        }
    }, [sessionData, dispatch])

    // Fetch agent details on component mount
    useEffect(() => {
        fetchAgentDetails()
    }, [fetchAgentDetails])

    // Initialize first message when session data is available
    useEffect(() => {
        if (sessionData && sessionData.messages.length === 0 && !firstMessageInitialized && sessionData.customer?.name) {
            initializeFirstMessage(sessionData.customer.name)
            setFirstMessageInitialized(true)
        }
    }, [sessionData, firstMessageInitialized, initializeFirstMessage])

    // Handle scrolling and store initialization
    useEffect(() => {
        scrollToBottom()
        // Initialize store for Redux DevTools
        console.log('Initializing Chat Store for Redux DevTools...')
        dispatch(initializeStore())
        console.log('Chat Store initialized successfully')
    }, [messages.length, dispatch])

    // Scroll to bottom when typing indicator changes (with slight delay for smoother animation)
    useEffect(() => {
        if (showTyping) {
            // Small delay to let the typing indicator animation start before scrolling
            const scrollTimer = setTimeout(() => {
                scrollToBottom()
            }, 50)
            return () => clearTimeout(scrollTimer)
        }
    }, [showTyping])

    // Convert API messages to local format
    const formattedMessages: Message[] = messages.map(msg => {
        // Parse JSON content if it's a JSON string, otherwise use as-is
        let displayContent = msg.content
        if (typeof msg.content === 'string' && msg.content.startsWith('{')) {
            try {
                const parsedContent = JSON.parse(msg.content)
                displayContent = parsedContent.content || msg.content
            } catch (parseError) {
                // If parsing fails, use the original content
                console.warn('Failed to parse message content:', parseError)
            }
        }

        return {
            id: msg?.id?.toString(),
            content: displayContent,
            sender: msg.sender === "Assistant" ? "assistant" : "user",
            timestamp: new Date(msg.created_at)
        }
    })

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

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || !sessionData || sessionData?.session?.session_closed) return

        const newMessage = {
            id: Date.now(),
            sender: "User",
            receiver: "Assistant",
            content: JSON.stringify({
                role: "User",
                content: inputMessage
            }),
            session_id: sessionData.session?.id || 0,
            created_at: new Date().toISOString()
        }

        // Add user message to Redux store
        dispatch(addMessage(newMessage))
        setInputMessage("")

        // Start loading and typing indicator
        setIsAIResponseLoading(true)
        isLoadingRef.current = true
        manageTypingIndicator()

        try {
            // Send all data to webhook endpoint
            const webhookData = {
                customer: sessionData.customer,
                session: sessionData.session,
                messages: [...sessionData.messages, newMessage], // Include the new message
                collected_data: sessionData.collected_data,
                is_new_session: sessionData.is_new_session,
                user_message: inputMessage, // The current message being sent
                agent: agent // Include agent details
            }

            const webhookResponse: WebhookResponse = await agentsAPI.sendWebhookMessage(webhookData) as WebhookResponse
            console.log("this is the webhook response", webhookResponse)

            // Handle AI message from webhook
            if (webhookResponse && webhookResponse.ai_message) {
                const aiMessage = webhookResponse.ai_message

                // Parse the AI message content if it's JSON
                let assistantContent = aiMessage.content
                if (typeof assistantContent === 'string' && assistantContent.startsWith('{')) {
                    try {
                        const parsedContent = JSON.parse(assistantContent)
                        assistantContent = parsedContent.content || assistantContent
                    } catch (parseError) {
                        console.warn('Failed to parse AI message content:', parseError)
                    }
                }

                // Add AI message to Redux store
                const assistantMessage = {
                    id: aiMessage.id,
                    sender: aiMessage.sender,
                    receiver: aiMessage.receiver,
                    content: assistantContent,
                    session_id: aiMessage.session_id,
                    created_at: aiMessage.created_at
                }

                dispatch(addMessage(assistantMessage))
            }

            // Handle collected data from webhook
            if (webhookResponse && webhookResponse.collected_data) {
                dispatch(appendCollectedData(webhookResponse.collected_data))
            }

            // Handle session closed status
            if (webhookResponse && webhookResponse.session) {
                dispatch(updateSessionClosed(webhookResponse.session.session_closed))

                // If session is closed, show message and close chat after 5 seconds
                if (webhookResponse.session.session_closed) {
                    setShowSessionClosedMessage(true)
                    setTimeout(() => {
                        // Close the chat by redirecting or showing a modal
                        // For now, we'll just show the message
                        console.log('Session closed - chat should be closed now')
                    }, 5000)
                }
            }
        } catch (err) {
            console.error("Error sending message to webhook:", err)
            // You might want to show an error message to the user here
        } finally {
            // Stop loading and typing indicator
            setIsAIResponseLoading(false)
            isLoadingRef.current = false
            setShowTyping(false)
        }
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
                    <div className="flex items-center space-x-4">
                        <Image src="/logos/simple_logo.png" alt="logo" width={40} height={40} />
                        <div>
                            <h1 className="text-white text-lg font-medium">
                                {agent?.name || (sessionData?.customer?.name ? `Chat with ${sessionData.customer.name}` : "Assistant Chat Assistant")}
                            </h1>
                            {agent?.description && (
                                <p className="text-gray-400 text-sm">{agent.description}</p>
                            )}
                            {sessionData?.is_new_session && !agent?.description && (
                                <p className="text-gray-400 text-sm">Welcome! This is your first chat session.</p>
                            )}
                        </div>
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
                                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${message.sender === "user"
                                    ? "bg-purple-600 text-white"
                                    : "bg-gray-700 text-gray-100"
                                    }`}
                            >
                                <p className="text-sm">{message.content} </p>
                                <p className="text-xs opacity-70 mt-1">
                                    {message.timestamp.toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    ))
                )}

                {/* Typing Indicator */}
                <div className={`flex justify-start transition-all duration-300 ease-in-out ${
                    showTyping
                        ? 'opacity-100 transform translate-y-0 max-h-12'
                        : 'opacity-0 transform -translate-y-2 max-h-0 overflow-hidden'
                }`}>
                    <div className="max-w-xs lg:max-w-md px-3 py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600">
                        <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                            <span className="text-xs text-gray-400">AI is typing...</span>
                        </div>
                    </div>
                </div>

                <div ref={messagesEndRef} />
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-900 border-l-4 border-red-500 p-4 mx-4 mb-2">
                    <p className="text-red-200 text-sm">{error}</p>
                </div>
            )}

            {/* Session Closed Message */}
            {showSessionClosedMessage && (
                <div className="bg-blue-900 border-l-4 border-blue-500 p-4 mx-4 mb-2">
                    <p className="text-blue-200 text-sm">This session has ended. Thanks for providing the information!</p>
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
                                sender: 'User',
                                receiver: 'Assistant',
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
                        placeholder={sessionData?.session?.session_closed ? "Session has ended" : "Type your message..."}
                        className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                        disabled={sessionData?.session?.session_closed}
                    />
                    <Button
                        onClick={handleSendMessage}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        disabled={!inputMessage.trim() || sessionData?.session?.session_closed}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
