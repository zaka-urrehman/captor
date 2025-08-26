"""
Models package - exports all database models.
"""

# Import all models to ensure they are registered with SQLModel
from .base import BaseTable, TimestampMixin
from .user import User, UserCreate, UserRead, UserUpdate
from .agent import Agent, AgentCreate, AgentRead, AgentUpdate
from .customer import Customer, CustomerCreate, CustomerRead, CustomerUpdate
from .chat import (
    ChatSession, ChatSessionCreate, ChatSessionRead,
    Message, MessageCreate, MessageRead,
    AgentOutput, AgentOutputCreate, AgentOutputRead
)
from .data_schema import (
    AgentDataSchema, AgentDataSchemaCreate, AgentDataSchemaRead,
    AgentDataField, AgentDataFieldCreate, AgentDataFieldRead,
    CollectedData, CollectedDataCreate, CollectedDataRead
)

# Export all table models for database creation
__all__ = [
    # Base classes
    "BaseTable",
    "TimestampMixin",
    
    # User models
    "User",
    "UserCreate",
    "UserRead", 
    "UserUpdate",
    
    # Agent models
    "Agent",
    "AgentCreate",
    "AgentRead",
    "AgentUpdate",
    
    # Customer models
    "Customer",
    "CustomerCreate",
    "CustomerRead",
    "CustomerUpdate",
    
    # Chat models
    "ChatSession",
    "ChatSessionCreate",
    "ChatSessionRead",
    "Message",
    "MessageCreate",
    "MessageRead",
    "AgentOutput",
    "AgentOutputCreate",
    "AgentOutputRead",
    
    # Data schema models
    "AgentDataSchema",
    "AgentDataSchemaCreate",
    "AgentDataSchemaRead",
    "AgentDataField",
    "AgentDataFieldCreate",
    "AgentDataFieldRead",
    "CollectedData",
    "CollectedDataCreate",
    "CollectedDataRead",
]