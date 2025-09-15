import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
    ChatSessionResponse,
    ChatMessage,
    ChatCustomer,
    ChatSession,
    CollectedData,
    Agent
} from '@/types/agents'

type AgentWithoutSessions = Omit<Agent, 'chat_sessions'>

interface ChatState {
    // Session data
    sessionData: ChatSessionResponse | null

    // Agent data
    agent: AgentWithoutSessions | null

    // Loading states
    isLoading: boolean
    error: string | null
}

const initialState: ChatState = {
    sessionData: null,
    agent: null,
    isLoading: false,
    error: null,
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setSessionData: (state, action: PayloadAction<ChatSessionResponse>) => {
            state.sessionData = action.payload
            state.isLoading = false
            state.error = null
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },

        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
            state.isLoading = false
        },

        setAgentData: (state, action: PayloadAction<AgentWithoutSessions>) => {
            state.agent = action.payload
        },

        addMessage: (state, action: PayloadAction<ChatMessage>) => {
            if (state.sessionData) {
                state.sessionData.messages.push(action.payload)
            }
        },

        updateCollectedData: (state, action: PayloadAction<CollectedData>) => {
            if (state.sessionData) {
                const existingIndex = state.sessionData.collected_data.findIndex(
                    item => item.field_id === action.payload.field_id
                )
                if (existingIndex >= 0) {
                    state.sessionData.collected_data[existingIndex] = action.payload
                } else {
                    state.sessionData.collected_data.push(action.payload)
                }
            }
        },

        appendCollectedData: (state, action: PayloadAction<CollectedData>) => {
            if (state.sessionData) {
                state.sessionData.collected_data.push(action.payload)
            }
        },

        updateSessionClosed: (state, action: PayloadAction<boolean>) => {
            if (state.sessionData?.session) {
                state.sessionData.session.session_closed = action.payload
            }
        },

        clearSession: () => ({
            sessionData: null,
            agent: null,
            isLoading: false,
            error: null
        }),

        initializeStore: () => {
            // Initialize action for Redux DevTools
            console.log('Chat store initialized')
        },
    },
})

export const {
    setSessionData,
    setLoading,
    setError,
    setAgentData,
    addMessage,
    updateCollectedData,
    appendCollectedData,
    updateSessionClosed,
    clearSession,
    initializeStore,
} = chatSlice.actions

export type { AgentWithoutSessions }

export default chatSlice.reducer
