"""
User routes - Route definitions for user management.
"""
from typing import Annotated, List
from fastapi import APIRouter, Depends, Query
from sqlmodel import Session

from ..database import get_session
from ..models.user import User, UserRead, UserUpdate
from ..core.dependencies import get_current_active_user
from ..controllers.user_controller import UserController
from ..core.responses import APIResponse, PaginatedResponse, MessageResponse


router = APIRouter()


@router.get("/", response_model=PaginatedResponse[UserRead])
def get_users(
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_active_user)],
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100)
):
    """Get list of users."""
    return UserController.get_users(session, skip=skip, limit=limit)


@router.get("/{user_id}", response_model=APIResponse[UserRead])
def get_user(
    user_id: int,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    """Get user by ID."""
    return UserController.get_user_by_id(session, user_id)


@router.put("/{user_id}", response_model=APIResponse[UserRead])
def update_user(
    user_id: int,
    user_update: UserUpdate,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    """Update user information."""
    return UserController.update_user(session, user_id, user_update)


@router.delete("/{user_id}", response_model=MessageResponse)
def delete_user(
    user_id: int,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    """Delete user."""
    return UserController.delete_user(session, user_id)
