# Authentication API Documentation

## Overview

This module provides a complete authentication system for the CAPTOR frontend application, including login, signup, and token management.

## Files Structure

- `src/lib/api.ts` - Main axios client and authentication API functions
- `src/types/auth.ts` - TypeScript interfaces for authentication
- `src/hooks/useAuth.ts` - React hook for authentication state management

## API Endpoints

### Signup
- **Endpoint**: `POST /api/auth/signup`
- **Content-Type**: `application/json`
- **Request Body**:
```json
{
  "name": "string",
  "email": "string", 
  "password": "string"
}
```

### Login
- **Endpoint**: `POST /api/auth/login`
- **Content-Type**: `multipart/form-data`
- **Request Body** (FormData):
```
email: string
password: string
```

### Response Structure
All API responses follow this structure:
```json
{
  "success": boolean,
  "message": "string",
  "data": any | null,
  "errors": {
    "field_name": ["error message 1", "error message 2"]
  } | null,
  "meta": any | null
}
```

#### Login Success Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer"
  },
  "errors": null,
  "meta": null
}
```

#### Error Response:
```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": {
    "email": ["Email is required"],
    "password": ["Password must be at least 8 characters"]
  },
  "meta": null
}
```

## Usage Examples

### Using the authAPI directly

```typescript
import { authAPI } from '@/lib/api';

// Signup
try {
  const response = await authAPI.signup({
    name: "John Doe",
    email: "john@example.com",
    password: "securepassword"
  });
  
  if (response.success) {
    console.log('Signup successful:', response.message);
    // Handle success - maybe redirect to login
  } else {
    console.error('Signup failed:', response.message);
    if (response.errors) {
      // Handle validation errors
      Object.entries(response.errors).forEach(([field, messages]) => {
        console.error(`${field}: ${messages.join(', ')}`);
      });
    }
  }
} catch (error) {
  console.error('Network/Server error:', error);
}

// Login
try {
  const response = await authAPI.login({
    email: "john@example.com",
    password: "securepassword"
  });
  
  if (response.success && response.data) {
    console.log('Login successful:', response.message);
    console.log('Access token:', response.data.access_token);
    // Token is automatically stored in localStorage
  } else {
    console.error('Login failed:', response.message);
  }
} catch (error) {
  console.error('Network/Server error:', error);
}

// Logout
authAPI.logout();
```

### Using the useAuth hook (Recommended)

```typescript
import { useAuth } from '@/hooks/useAuth';

function LoginComponent() {
  const { login, signup, logout, isLoading, error } = useAuth();

  const handleLogin = async () => {
    const result = await login({
      email: "john@example.com",
      password: "securepassword"
    });
    
    if (result) {
      // Login successful, redirect user
      router.push('/dashboard');
    }
    // Error is automatically managed by the hook
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <button onClick={handleLogin} disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </div>
  );
}
```

## Token Management

- Tokens are automatically stored in localStorage upon successful login
- Tokens are automatically attached to all API requests via axios interceptors
- Tokens are automatically removed on logout or 401 errors
- The system handles both `token` and `access_token` response formats

## Error Handling

- All API functions include proper error handling
- The useAuth hook provides centralized error state management
- 401 errors automatically redirect to login page and clear stored tokens
- Detailed error messages are extracted from API responses

## Environment Variables

Make sure to set your backend URL:

```env
NEXT_PUBLIC_BACKEND_BASE_URL=http://localhost:8000
```

If not set, it defaults to `http://localhost:8000`.
