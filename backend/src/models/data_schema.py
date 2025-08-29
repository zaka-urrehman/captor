"""
Dynamic agent data schema models.
"""
from typing import Optional, List, TYPE_CHECKING, Any
from sqlmodel import SQLModel, Field, Relationship, Column
from sqlalchemy import JSON
from .base import BaseTable

if TYPE_CHECKING:
    from .agent import Agent, AgentRead
    from .chat import ChatSession


class AgentDataSchemaBase(SQLModel):
    """Base agent data schema fields."""
    
    type: str = Field(max_length=20, nullable=False)  # "qa" or "json"


class AgentDataSchema(AgentDataSchemaBase, BaseTable, table=True):
    """Agent data schema table for dynamic data collection modes."""
    
    __tablename__ = "agent_data_schemas"
    
    agent_id: int = Field(foreign_key="agents.id", nullable=False, index=True)
    
    # Relationships
    agent: "Agent" = Relationship(back_populates="data_schemas")
    fields: List["AgentDataField"] = Relationship(back_populates="data_schema")


class AgentDataSchemaCreate(AgentDataSchemaBase):
    """Agent data schema creation schema."""
    
    agent_id: int


class AgentDataSchemaRead(AgentDataSchemaBase):
    """Agent data schema read schema."""
    
    id: int
    agent_id: int
    created_at: str
    fields: List["AgentDataFieldRead"] = []


class AgentDataFieldBase(SQLModel):
    """Base agent data field fields."""
    
    key: Optional[str] = Field(default=None, max_length=255, nullable=True)  # for json schema (field name)
    question: Optional[str] = Field(default=None, nullable=True)  # for QA schema
    data_type: str = Field(max_length=50, nullable=False)  # string, number, email, etc.
    required: bool = Field(default=False, nullable=False)
    validation_rules: dict = Field(default_factory=dict, sa_column=Column(JSON))  # extra rules/validation


class AgentDataField(AgentDataFieldBase, BaseTable, table=True):
    """Agent data field table for fields/questions inside schema."""

    __tablename__ = "agent_data_fields"

    schema_id: int = Field(foreign_key="agent_data_schemas.id", nullable=False, index=True)

    # Relationships
    data_schema: "AgentDataSchema" = Relationship(back_populates="fields")
    collected_data: List["CollectedData"] = Relationship(back_populates="field")


class AgentDataFieldCreate(AgentDataFieldBase):
    """Agent data field creation schema."""

    # schema_id is set automatically by the server, no need to include it here


class AgentDataFieldRead(AgentDataFieldBase):
    """Agent data field read schema."""

    id: int
    schema_id: int
    created_at: str


class CollectedDataBase(SQLModel):
    """Base collected data fields."""

    answer: str = Field(nullable=False)  # collected answer text


class CollectedData(CollectedDataBase, BaseTable, table=True):
    """Collected data table for data collected during sessions."""

    __tablename__ = "collected_data"

    session_id: int = Field(foreign_key="chat_sessions.id", nullable=False, index=True)
    field_id: int = Field(foreign_key="agent_data_fields.id", nullable=False, index=True)

    # Relationships
    session: "ChatSession" = Relationship(back_populates="collected_data")
    field: "AgentDataField" = Relationship(back_populates="collected_data")


class CollectedDataCreate(CollectedDataBase):
    """Collected data creation schema."""

    session_id: int
    field_id: int


class CollectedDataRead(CollectedDataBase):
    """Collected data read schema."""

    id: int
    session_id: int
    field_id: int
    created_at: str


class AgentDataSchemaUpdate(SQLModel):
    """Agent data schema update schema."""

    type: Optional[str] = None


class AgentDataFieldUpdate(SQLModel):
    """Agent data field update schema."""

    key: Optional[str] = None
    question: Optional[str] = None
    data_type: Optional[str] = None
    required: Optional[bool] = None
    validation_rules: Optional[dict] = None

AgentDataSchema.model_rebuild()
AgentDataField.model_rebuild()
CollectedData.model_rebuild()