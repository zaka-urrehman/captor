"""
Agent model for AI agents created by users.
"""
from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from .base import BaseTable
from .data_schema import AgentDataFieldCreate, AgentDataSchemaRead, AgentDataFieldUpdate
from .chat import ChatSessionRead


if TYPE_CHECKING:
    from .user import User
    from .customer import Customer
    from .chat import ChatSession
    from .data_schema import AgentDataSchema, AgentDataField

class AgentBase(SQLModel):
    """Base agent fields."""

    name: str = Field(max_length=255, nullable=False)
    description: Optional[str] = Field(default=None, nullable=True)
    system_prompt: Optional[str] = Field(default=None, nullable=True)
    user_instructions: Optional[str] = Field(default=None, nullable=True)
    webhook_url: Optional[str] = Field(default=None, max_length=255, nullable=True)
    chat_url: Optional[str] = Field(default=None, max_length=255, nullable=True)


class Agent(AgentBase, BaseTable, table=True):
    """Agent table for AI agents created by users."""
    
    __tablename__ = "agents"
    
    user_id: int = Field(foreign_key="users.id", nullable=False, index=True)
    
    # Relationships
    user: "User" = Relationship(back_populates="agents")
    customers: List["Customer"] = Relationship(back_populates="agent")
    chat_sessions: List["ChatSession"] = Relationship(back_populates="agent")
    data_schemas: List["AgentDataSchema"] = Relationship(back_populates="agent")


class AgentCreateBase(SQLModel):
    """Base fields for agent creation (without chat_url)."""

    name: str = Field(max_length=255, nullable=False)
    description: Optional[str] = Field(default=None, nullable=True)
    system_prompt: Optional[str] = Field(default=None, nullable=True)
    user_instructions: Optional[str] = Field(default=None, nullable=True)
    webhook_url: Optional[str] = Field(default=None, max_length=255, nullable=True)


class AgentCreate(AgentCreateBase):
    """Agent creation schema."""

    type: str = Field(max_length=20, nullable=False) # "qa" or "json"
    agent_data_fields: List["AgentDataFieldCreate"]


class AgentChatUrlUpdate(SQLModel):
    """Schema for updating agent chat_url."""

    chat_url: str = Field(max_length=255, nullable=False)


class AgentRead(AgentBase):
    """Agent read schema."""

    id: int
    user_id: int
    created_at: str
    updated_at: Optional[str] = None
    data_schemas: List[AgentDataSchemaRead] = []
    chat_sessions: List[ChatSessionRead] = []


class AgentUpdate(SQLModel):
    """Agent update schema."""

    name: Optional[str] = None
    description: Optional[str] = None
    system_prompt: Optional[str] = None
    user_instructions: Optional[str] = None
    webhook_url: Optional[str] = None
    chat_url: Optional[str] = None
    type: Optional[str] = None
    agent_data_fields: Optional[List["AgentDataFieldUpdate"]] = None



AgentCreate.model_rebuild()