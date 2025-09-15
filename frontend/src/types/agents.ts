export interface AgentDataFieldRequest {
    key: string
    question: string
    data_type: string
    required: boolean
    validation_rules: Record<string, unknown>
}

export interface CreateAgentRequest {
    name: string
    description: string
    system_prompt: string
    user_instructions: string
    webhook_url: string
    type: string
    agent_data_fields: AgentDataFieldRequest[]
}

export interface AgentDataField {
    key: string
    question: string
    data_type: string
    required: boolean
    validation_rules: Record<string, unknown>
    id: number
    schema_id: number
    created_at: string
}

export interface AgentDataSchema {
    type: string
    id: number
    agent_id: number
    created_at: string
    fields: AgentDataField[]
}

export interface AgentChatSession {
    id: number
    agent_id: number
    user_id: number
    session_data: Record<string, unknown>
    created_at: string
    updated_at: string | null
}

export interface Agent {
    name: string
    description: string
    system_prompt: string
    user_instructions: string
    webhook_url: string
    chat_url: string | null
    id: number
    user_id: number
    created_at: string
    updated_at: string | null
    data_schemas: AgentDataSchema[]
    chat_sessions: AgentChatSession[]
}

export interface AgentsResponse {
    success: boolean
    message: string
    data: Agent[]
    meta: {
        pagination: {
            total: number
            page: number
            page_size: number
            total_pages: number
            has_next: boolean
            has_prev: boolean
        }
    }
}

export interface ApiEnvelope<T = any> {
    success?: boolean
    message?: string
    data?: T
}

// Chat Session Types
export interface ChatCustomer {
    name: string
    email: string
    id: number
    agent_id: number
    created_at: string
}

export interface ChatSession {
    started_at: string
    ended_at: string | null
    customer_name: string
    customer_email: string
    id: number
    agent_id: number
    created_at: string
    updated_at: string | null
    session_closed: boolean
}

export interface ChatMessage {
    sender: string
    receiver: string
    content: string
    id: number
    session_id: number
    created_at: string
}

export interface CollectedData {
    answer: string
    id: number
    session_id: number
    field_id: number
    created_at: string
}

export interface ChatSessionResponse {
    customer: ChatCustomer
    session: ChatSession
    messages: ChatMessage[]
    collected_data: CollectedData[]
    is_new_session: boolean
}

export interface CreateSessionRequest {
    agent_id: number
    customer_name: string
    customer_email: string
}


