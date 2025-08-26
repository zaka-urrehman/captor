"""
Standard API response formats for consistent responses across all endpoints.
"""
from typing import Any, Optional, List, TypeVar, Generic
from pydantic import BaseModel

T = TypeVar('T')


class APIResponse(BaseModel, Generic[T]):
    """Standard API response format."""
    
    success: bool
    message: str
    data: Optional[T] = None
    errors: Optional[List[str]] = None
    meta: Optional[dict] = None

    @classmethod
    def success_response(
        cls, 
        data: Optional[T] = None, 
        message: str = "Operation successful",
        meta: Optional[dict] = None
    ) -> "APIResponse[T]":
        """Create a successful response."""
        return cls(
            success=True,
            message=message,
            data=data,
            meta=meta
        )

    @classmethod
    def error_response(
        cls,
        message: str = "Operation failed",
        errors: Optional[List[str]] = None,
        data: Optional[T] = None
    ) -> "APIResponse[T]":
        """Create an error response."""
        return cls(
            success=False,
            message=message,
            errors=errors or [],
            data=data
        )


class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated response format."""
    
    success: bool = True
    message: str = "Data retrieved successfully"
    data: List[T]
    meta: dict

    @classmethod
    def create(
        cls,
        data: List[T],
        total: int,
        page: int = 1,
        page_size: int = 10,
        message: str = "Data retrieved successfully"
    ) -> "PaginatedResponse[T]":
        """Create a paginated response."""
        total_pages = (total + page_size - 1) // page_size
        
        return cls(
            success=True,
            message=message,
            data=data,
            meta={
                "pagination": {
                    "total": total,
                    "page": page,
                    "page_size": page_size,
                    "total_pages": total_pages,
                    "has_next": page < total_pages,
                    "has_prev": page > 1
                }
            }
        )


# Common response types for convenience
class MessageResponse(BaseModel):
    """Simple message response."""
    
    success: bool
    message: str

    @classmethod
    def success_message(cls, message: str = "Operation successful") -> "MessageResponse":
        """Create success message response."""
        return cls(success=True, message=message)

    @classmethod
    def error_message(cls, message: str = "Operation failed") -> "MessageResponse":
        """Create error message response."""
        return cls(success=False, message=message)


# Response helper functions
def success_response(
    data: Any = None, 
    message: str = "Operation successful",
    meta: Optional[dict] = None
) -> APIResponse:
    """Helper function to create success response."""
    return APIResponse.success_response(data=data, message=message, meta=meta)


def error_response(
    message: str = "Operation failed",
    errors: Optional[List[str]] = None,
    data: Any = None
) -> APIResponse:
    """Helper function to create error response."""
    return APIResponse.error_response(message=message, errors=errors, data=data)


def paginated_response(
    data: List[Any],
    total: int,
    page: int = 1,
    page_size: int = 10,
    message: str = "Data retrieved successfully"
) -> PaginatedResponse:
    """Helper function to create paginated response."""
    return PaginatedResponse.create(
        data=data,
        total=total,
        page=page,
        page_size=page_size,
        message=message
    )
