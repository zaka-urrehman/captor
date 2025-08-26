"""
Base model classes and shared functionality.
"""
from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field


class TimestampMixin(SQLModel):
    """Mixin for created_at and updated_at timestamps."""
    
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: Optional[datetime] = Field(default=None, nullable=True, sa_column_kwargs={"onupdate": datetime.utcnow})


class BaseTable(TimestampMixin):
    """Base table with id and timestamps."""
    
    id: Optional[int] = Field(default=None, primary_key=True)
