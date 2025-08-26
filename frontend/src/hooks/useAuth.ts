import { useState } from 'react';
import { authAPI } from '@/lib/api';
import { formatApiErrorMessage, formatHttpErrorMessage } from '@/utils/errorHandling';
import type { SignupRequest, LoginRequest, LoginResponse, SignupResponse } from '@/types/auth';

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const signup = async (userData: SignupRequest): Promise<SignupResponse | null> => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await authAPI.signup(userData);
            
            // Check if the response indicates success
            if (!response.success) {
                const errorMessage = formatApiErrorMessage(response, 'Signup failed. Please try again.');
                setError(errorMessage);
                return null;
            }
            
            return response;
        } catch (err: any) {
            const errorMessage = formatHttpErrorMessage(err, 'Signup failed. Please try again.');
            setError(errorMessage);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials: LoginRequest): Promise<LoginResponse | null> => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await authAPI.login(credentials);
            
            // Check if the response indicates success
            if (!response.success) {
                const errorMessage = formatApiErrorMessage(response, 'Login failed. Please check your credentials.');
                setError(errorMessage);
                return null;
            }
            
            return response;
        } catch (err: any) {
            const errorMessage = formatHttpErrorMessage(err, 'Login failed. Please check your credentials.');
            setError(errorMessage);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authAPI.logout();
        // You might want to redirect to login page here
        if (typeof window !== "undefined") {
            window.location.href = "/login";
        }
    };

    const clearError = () => {
        setError(null);
    };

    return {
        signup,
        login,
        logout,
        isLoading,
        error,
        clearError
    };
};
