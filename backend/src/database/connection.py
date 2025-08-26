"""
Database connection and session management.
"""
from sqlmodel import SQLModel, create_engine, Session
from typing import Generator
import logging
from src.core.config import DATABASE_URL, DEBUG  

logger = logging.getLogger(__name__)

# Get database URL from settings
database_url = str(DATABASE_URL)
print(f"Using database: {database_url}")
logger.info(f"Using database: {database_url.split('://')[0]}://[connection details hidden]")

# Create database engine with appropriate settings
engine_kwargs = {
    "echo": DEBUG,  # Log SQL queries in debug mode
}

# Add connection pool settings for PostgreSQL
if database_url.startswith("postgresql"):
    engine_kwargs.update({
        "pool_pre_ping": True,   # Verify connections before use
        "pool_recycle": 3600,    # Recycle connections after 1 hour
    })

engine = create_engine(database_url, **engine_kwargs)


def create_db_and_tables():
    """Create database tables with error handling."""
    try:
        logger.info("Creating database tables...")
        SQLModel.metadata.create_all(engine)
        logger.info("Database tables created successfully!")
    except Exception as e:
        logger.error(f"Failed to create database tables: {e}")
        logger.error("Please check your database connection and try again.")
        raise


def get_session() -> Generator[Session, None, None]:
    """
    Get database session.
    
    Yields:
        Session: Database session.
    """
    with Session(engine) as session:
        yield session
