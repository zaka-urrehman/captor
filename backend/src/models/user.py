"""
User model for SaaS accounts.
"""
from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from .base import BaseTable

if TYPE_CHECKING:
    from .agent import Agent


class UserBase(SQLModel):
    """Base user fields."""
    
    name: str = Field(max_length=255, nullable=False)
    email: str = Field(max_length=255, unique=True, nullable=False, index=True)


class User(UserBase, BaseTable, table=True):
    """User table for SaaS accounts."""
    
    __tablename__ = "users"
    
    password_hash: str = Field(max_length=255, nullable=False)
    
    # Relationships
    agents: List["Agent"] = Relationship(back_populates="user")


class UserCreate(UserBase):
    """User creation schema."""
    
    password: str = Field(min_length=8)


class UserRead(UserBase):
    """User read schema."""
    
    id: int
    created_at: str
    updated_at: Optional[str] = None


class UserUpdate(SQLModel):
    """User update schema."""
    
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
