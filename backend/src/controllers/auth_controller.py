"""
Authentication controller - Business logic for user authentication.
"""
from datetime import timedelta
from typing import Optional
from fastapi import HTTPException, status
from sqlmodel import Session, select

from ..models.user import User, UserRead
from ..core.auth import verify_password, get_password_hash, create_access_token
from ..core.config import ACCESS_TOKEN_EXPIRE_MINUTES
from ..core.responses import APIResponse, success_response, error_response


class AuthController:
    """Controller for authentication operations."""
    
    @staticmethod
    def create_user(session: Session, name: str, email: str, password: str) -> APIResponse[UserRead]:
        """Create a new user account."""
        # Check if user already exists
        statement = select(User).where(User.email == email)
        existing_user = session.exec(statement).first()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        hashed_password = get_password_hash(password)
        db_user = User(
            name=name,
            email=email,
            password_hash=hashed_password
        )
        
        session.add(db_user)
        session.commit()
        session.refresh(db_user)
        
        user_data = UserRead(
            id=db_user.id,
            name=db_user.name,
            email=db_user.email,
            created_at=db_user.created_at.isoformat(),
            updated_at=db_user.updated_at.isoformat() if db_user.updated_at else None
        )
        
        return success_response(
            data=user_data,
            message="User registered successfully"
        )
    
    @staticmethod
    def authenticate_user(session: Session, email: str, password: str) -> APIResponse[dict]:
        """Authenticate user and return access token."""
        # Find user by email
        statement = select(User).where(User.email == email)
        user = session.exec(statement).first()
        
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email},
            expires_delta=access_token_expires
        )
        
        token_data = {"access_token": access_token, "token_type": "bearer"}
        
        return success_response(
            data=token_data,
            message="Login successful"
        )
    
    @staticmethod
    def get_user_profile(user: User) -> APIResponse[UserRead]:
        """Get user profile information."""
        user_data = UserRead(
            id=user.id,
            name=user.name,
            email=user.email,
            created_at=user.created_at.isoformat(),
            updated_at=user.updated_at.isoformat() if user.updated_at else None
        )
        
        return success_response(
            data=user_data,
            message="User profile retrieved successfully"
        )
