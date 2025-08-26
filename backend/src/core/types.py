"""
Type definitions for the application.
"""
from typing import TypedDict, Optional


class JWTPayload(TypedDict):
    """JWT token payload structure."""
    sub: str  # subject (user email)
    exp: int  # expiration timestamp
    iat: Optional[int]  # issued at timestamp
