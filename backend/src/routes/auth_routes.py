"""
Authentication routes - Route definitions for user authentication.
"""
from typing import Annotated
from fastapi import APIRouter, Depends, Form
from sqlmodel import Session
from pydantic import BaseModel

from ..database import get_session
from ..models.user import User, UserRead
from ..core.dependencies import get_current_active_user
from ..controllers.auth_controller import AuthController
from ..core.responses import APIResponse


router = APIRouter()


class Token(BaseModel):
    """Token response model."""
    access_token: str
    token_type: str


class UserSignup(BaseModel):
    """User signup request model."""
    name: str
    email: str
    password: str


class UserLogin(BaseModel):
    """User login request model."""
    email: str
    password: str


@router.post("/signup", response_model=APIResponse[UserRead])
def signup(
    user_data: UserSignup,
    session: Annotated[Session, Depends(get_session)]
):
    """Register a new user."""
    return AuthController.create_user(
        session=session,
        name=user_data.name,
        email=user_data.email,
        password=user_data.password
    )


@router.post("/login", response_model=APIResponse[dict])
def login(
    email: Annotated[str, Form()],
    password: Annotated[str, Form()],
    session: Annotated[Session, Depends(get_session)]
):
    """Authenticate user and return access token."""
    return AuthController.authenticate_user(
        session=session,
        email=email,
        password=password
    )


@router.post("/login-json", response_model=APIResponse[dict])
def login_json(
    user_data: UserLogin,
    session: Annotated[Session, Depends(get_session)]
):
    """Authenticate user with JSON payload and return access token."""
    return AuthController.authenticate_user(
        session=session,
        email=user_data.email,
        password=user_data.password
    )


@router.get("/me", response_model=APIResponse[UserRead])
def get_current_user_profile(
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    """Get current user profile."""
    return AuthController.get_user_profile(current_user)
