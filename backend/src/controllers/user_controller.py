"""
User controller - Business logic for user operations.
"""
from typing import List, Optional
from fastapi import HTTPException, status
from sqlmodel import Session, select

from src.models.user import User, UserRead, UserUpdate
from src.core.auth import get_password_hash
from src.core.responses import APIResponse, success_response, paginated_response, MessageResponse

class UserController:
    """Controller for user operations."""
    
    @staticmethod
    def get_users(session: Session, skip: int = 0, limit: int = 100) -> APIResponse:
        """Get list of users."""
        statement = select(User).offset(skip).limit(limit)
        users = session.exec(statement).all()
        
        users_data = [
            UserRead(
                id=user.id,
                name=user.name,
                email=user.email,
                created_at=user.created_at.isoformat(),
                updated_at=user.updated_at.isoformat() if user.updated_at else None
            )
            for user in users
        ]
        
        # Get total count for pagination
        from sqlmodel import func
        total_statement = select(func.count(User.id))
        total = session.exec(total_statement).one()
        
        return paginated_response(
            data=users_data,
            total=total,
            page=(skip // limit) + 1,
            page_size=limit,
            message="Users retrieved successfully"
        )
    
    @staticmethod
    def get_user_by_id(session: Session, user_id: int) -> APIResponse[UserRead]:
        """Get user by ID."""
        user = session.get(User, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        user_data = UserRead(
            id=user.id,
            name=user.name,
            email=user.email,
            created_at=user.created_at.isoformat(),
            updated_at=user.updated_at.isoformat() if user.updated_at else None
        )
        
        return success_response(
            data=user_data,
            message="User retrieved successfully"
        )
    
    @staticmethod
    def update_user(session: Session, user_id: int, user_update: UserUpdate) -> APIResponse[UserRead]:
        """Update user information."""
        user = session.get(User, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Update fields if provided
        update_data = user_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            if field == "password":
                # Hash password before storing
                user.password_hash = get_password_hash(value)
            else:
                setattr(user, field, value)
        
        session.add(user)
        session.commit()
        session.refresh(user)
        
        user_data = UserRead(
            id=user.id,
            name=user.name,
            email=user.email,
            created_at=user.created_at.isoformat(),
            updated_at=user.updated_at.isoformat() if user.updated_at else None
        )
        
        return success_response(
            data=user_data,
            message="User updated successfully"
        )
    
    @staticmethod
    def delete_user(session: Session, user_id: int) -> MessageResponse:
        """Delete user."""
        user = session.get(User, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        session.delete(user)
        session.commit()
        
        return MessageResponse.success_message("User deleted successfully")
