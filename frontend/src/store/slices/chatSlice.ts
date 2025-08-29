import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
    ChatSessionResponse,
    ChatMessage,
    ChatCustomer,
    ChatSession,
    CollectedData
} from '@/types/agents'

interface ChatState {
    // Session data
    sessionData: ChatSessionResponse | null
    customer: ChatCustomer | null
    session: ChatSession | null
    messages: ChatMessage[]
    collectedData: CollectedData[]
    isNewSession: boolean

    // Loading states
    isLoading: boolean
    error: string | null
}

const initialState: ChatState = {
    sessionData: null,
    customer: null,
    session: null,
    messages: [],
    collectedData: [],
    isNewSession: false,
    isLoading: false,
    error: null,
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setSessionData: (state, action: PayloadAction<ChatSessionResponse>) => {
            state.sessionData = action.payload
            state.customer = action.payload.customer
            state.session = action.payload.session
            state.messages = action.payload.messages
            state.collectedData = action.payload.collected_data
            state.isNewSession = action.payload.is_new_session
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

        addMessage: (state, action: PayloadAction<ChatMessage>) => {
            state.messages.push(action.payload)
        },

        updateCollectedData: (state, action: PayloadAction<CollectedData>) => {
            const existingIndex = state.collectedData.findIndex(
                item => item.field_id === action.payload.field_id
            )
            if (existingIndex >= 0) {
                state.collectedData[existingIndex] = action.payload
            } else {
                state.collectedData.push(action.payload)
            }
        },

        clearSession: (state) => {
            state.sessionData = null
            state.customer = null
            state.session = null
            state.messages = []
            state.collectedData = []
            state.isNewSession = false
            state.isLoading = false
            state.error = null
        },

        initializeStore: (state) => {
            // Initialize action for Redux DevTools
            console.log('Chat store initialized')
        },
    },
})

export const {
    setSessionData,
    setLoading,
    setError,
    addMessage,
    updateCollectedData,
    clearSession,
    initializeStore,
} = chatSlice.actions

export default chatSlice.reducer
