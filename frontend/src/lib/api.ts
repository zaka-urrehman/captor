import axios from "axios";
import type { SignupRequest, LoginRequest, LoginResponse, SignupResponse } from "@/types/auth";
import type { CreateAgentRequest, ApiEnvelope, AgentsResponse, CreateSessionRequest, ChatSessionResponse } from "@/types/agents";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // keep true if you might use cookies later
});

// 🔹 Attach JWT token from localStorage (if exists)
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// 🔹 Handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
                // Clear the token since it's invalid
                localStorage.removeItem("token");
                
                // Only redirect to login if we're not already on auth pages
                const currentPath = window.location.pathname;
                const isOnAuthPage = currentPath.startsWith('/login') || 
                                   currentPath.startsWith('/signup') || 
                                   currentPath.startsWith('/forgot-password') ||
                                   currentPath.startsWith('/reset-password');
                
                if (!isOnAuthPage) {
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

// 🔹 Authentication API Functions
export const authAPI = {
    // Signup endpoint - uses JSON format
    signup: async (userData: SignupRequest): Promise<SignupResponse> => {
        try {
            const response = await api.post('/api/auth/signup', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Login endpoint - uses FormData format
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        try {
            const formData = new FormData();
            formData.append('email', credentials.email);
            formData.append('password', credentials.password);

            const response = await api.post('/api/auth/login', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            // Store token if login was successful
            const responseData: LoginResponse = response.data;
            if (responseData.success && responseData.data?.access_token) {
                if (typeof window !== "undefined") {
                    localStorage.setItem("token", responseData.data.access_token);
                }
            }
            
            return responseData;
        } catch (error) {
            throw error;
        }
    },

    // Logout function to clear token
    logout: () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
        }
    }
};

// 🔹 Agents API Functions
export const agentsAPI = {
    getAgents: async (): Promise<AgentsResponse> => {
        try {
            const response = await api.get('/api/agents')
            return response.data
        } catch (error) {
            throw error
        }
    },

    createAgent: async (payload: CreateAgentRequest): Promise<ApiEnvelope> => {
        try {
            const response = await api.post('/api/agents/create-agent', payload)
            return response.data
        } catch (error) {
            throw error
        }
    },

    deleteAgent: async (agentId: number): Promise<ApiEnvelope> => {
        try {
            const response = await api.delete(`/api/agents/${agentId}`)
            return response.data
        } catch (error) {
            throw error
        }
    },

    addChatUrl: async (agentId: number, chatUrl: string): Promise<ApiEnvelope> => {
        try {
            const response = await api.post(`/api/agents/${agentId}/add-chat-url`, {
                chat_url: chatUrl
            })
            return response.data
        } catch (error) {
            throw error
        }
    },

    deleteChatUrl: async (agentId: number): Promise<ApiEnvelope> => {
        try {
            const response = await api.delete(`/api/agents/${agentId}/chat-url`)
            return response.data
        } catch (error) {
            throw error
        }
    },

    getOrCreateSession: async (requestData: CreateSessionRequest): Promise<ChatSessionResponse> => {
        try {
            const response = await api.post('/api/chat/get-or-create-session', requestData)
            return response.data
        } catch (error) {
            throw error
        }
    },
};

export default api;
