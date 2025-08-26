"""
Customer model for end-users who interact with agent links.
"""
from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from .base import BaseTable

if TYPE_CHECKING:
    from .agent import Agent
    from .chat import ChatSession


class CustomerBase(SQLModel):
    """Base customer fields."""
    
    name: Optional[str] = Field(default=None, max_length=255, nullable=True)
    email: Optional[str] = Field(default=None, max_length=255, nullable=True)


class Customer(CustomerBase, BaseTable, table=True):
    """Customer table for end-users who interact with agent links."""
    
    __tablename__ = "customers"
    
    agent_id: int = Field(foreign_key="agents.id", nullable=False, index=True)
    
    # Relationships
    agent: "Agent" = Relationship(back_populates="customers")
    chat_sessions: List["ChatSession"] = Relationship(back_populates="customer")


class CustomerCreate(CustomerBase):
    """Customer creation schema."""
    
    agent_id: int


class CustomerRead(CustomerBase):
    """Customer read schema."""
    
    id: int
    agent_id: int
    created_at: str


class CustomerUpdate(SQLModel):
    """Customer update schema."""
    
    name: Optional[str] = None
    email: Optional[str] = None
