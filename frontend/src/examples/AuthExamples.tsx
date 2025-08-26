// Example usage of the updated authentication system
// This file is for reference only - not used in the actual app

import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export function LoginExample() {
    const { login, isLoading, error, clearError } = useAuth();
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const handleLogin = async () => {
        const result = await login(credentials);
        
        if (result && result.success) {
            console.log('Login successful!');
            console.log('Token:', result.data?.access_token);
            // Redirect user or update UI state
        }
        // Error handling is automatic via the useAuth hook
    };

    return (
        <div>
            {/* Error display */}
            {error && (
                <div className="error-banner">
                    {error}
                    <button onClick={clearError}>×</button>
                </div>
            )}

            {/* Login form */}
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <input
                    type="email"
                    value={credentials.email}
                    onChange={(e) => setCredentials(prev => ({...prev, email: e.target.value}))}
                    placeholder="Email"
                />
                <input
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({...prev, password: e.target.value}))}
                    placeholder="Password"
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}

// Example of different error scenarios and how they're handled:

/*
1. Validation Error Response:
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": {
    "email": ["Email is required", "Email must be valid"],
    "password": ["Password must be at least 8 characters"]
  }
}
-> Displayed as: "Email: Email is required, Email must be valid. Password: Password must be at least 8 characters"

2. Authentication Error Response:
{
  "success": false,
  "message": "Invalid credentials",
  "data": null,
  "errors": null
}
-> Displayed as: "Invalid credentials"

3. Network Error (no response):
-> Displayed as: "Network error. Please check your internet connection."

4. Server Error (500):
{
  "success": false,
  "message": "Internal server error",
  "data": null,
  "errors": null
}
-> Displayed as: "Internal server error"

5. Success Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJ...",
    "token_type": "bearer"
  },
  "errors": null
}
-> Token automatically stored, no error displayed
*/
