export interface WebhookResponse {
    ai_message: {
        sender: string
        receiver: string
        content: string
        id: number
        session_id: number
        created_at: string
    }
    collected_data: {
        answer: string
        id: number
        session_id: number
        field_id: number
        created_at: string
    }
    session: {
        id: number
        session_closed: boolean
    }
}

// Conversations list types
export interface ConversationListItem {
    id: number
    agent_id: number
    started_at: string
    ended_at: string | null
    customer_name: string
    customer_email: string
    session_closed: boolean
    created_at: string
    updated_at: string | null
    agent_name: string
    agent_description: string
    agent_webhook_url: string
    agent_chat_url: string | null
}

export interface ConversationsResponse {
    conversations: ConversationListItem[]
}

// Session details types (for conversation details view)
export interface SessionDetailsResponse {
    session: {
        started_at: string
        ended_at: string | null
        customer_name: string
        customer_email: string
        session_closed: boolean
        id: number
        agent_id: number
        created_at: string
        updated_at: string | null
    }
    messages: Array<{
        sender: string
        receiver: string
        content: string
        id: number
        session_id: number
        created_at: string
    }>
    collected_data: Array<{
        answer: string
        id: number
        session_id: number
        field_id: number
        created_at: string
    }>
}