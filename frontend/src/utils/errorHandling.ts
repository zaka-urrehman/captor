import type { ApiResponse } from '@/types/auth';

/**
 * Formats API error messages for display to users
 * @param response - The API response object
 * @param defaultMessage - Default message to show if no specific error is found
 * @returns Formatted error message string
 */
export function formatApiErrorMessage<T>(
    response: ApiResponse<T>, 
    defaultMessage: string = 'An error occurred. Please try again.'
): string {
    // If the response indicates success, return empty string
    if (response.success) {
        return '';
    }

    // Use the main message if available
    if (response.message) {
        return response.message;
    }

    // Format validation errors from the errors field
    if (response.errors) {
        const errorMessages: string[] = [];
        
        Object.entries(response.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
                // Capitalize field name for better UX
                const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
                errorMessages.push(`${fieldName}: ${messages.join(', ')}`);
            }
        });

        if (errorMessages.length > 0) {
            return errorMessages.join('. ');
        }
    }

    // Return default message if no specific errors found
    return defaultMessage;
}

/**
 * Formats HTTP error responses from axios
 * @param error - The axios error object
 * @param defaultMessage - Default message to show
 * @returns Formatted error message string
 */
export function formatHttpErrorMessage(
    error: any, 
    defaultMessage: string = 'Network error. Please check your connection.'
): string {
    if (error?.response?.data) {
        const errorData = error.response.data;
        
        // If it's our API response format
        if (typeof errorData.success === 'boolean') {
            return formatApiErrorMessage(errorData, defaultMessage);
        }
        
        // If it has a message field
        if (errorData.message) {
            return errorData.message;
        }
        
        // If it has errors field
        if (errorData.errors) {
            const errorMessages = Object.values(errorData.errors).flat();
            if (errorMessages.length > 0) {
                return errorMessages.join(', ');
            }
        }
    }
    
    // Handle network errors
    if (error?.code === 'NETWORK_ERROR' || error?.message === 'Network Error') {
        return 'Network error. Please check your internet connection.';
    }
    
    // Handle timeout errors
    if (error?.code === 'ECONNABORTED') {
        return 'Request timeout. Please try again.';
    }
    
    return defaultMessage;
}
