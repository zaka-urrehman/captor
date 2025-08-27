"""
CAPTOR Backend - FastAPI application with SQLModel database schema.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from src.core.config import APP_NAME, DEBUG
from src.routes import auth_routes, user_routes, agent_routes
from src.database import create_db_and_tables



@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    # Create database tables on startup
    create_db_and_tables()
    yield


app = FastAPI(
    title=APP_NAME,
    description="CAPTOR Backend API - AI Agent platform for data collection",
    version="1.0.0",
    debug=DEBUG,
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers with prefixes
app.include_router(auth_routes.router, prefix="/api/auth", tags=["authentication"])
app.include_router(user_routes.router, prefix="/api/users", tags=["users"])
app.include_router(agent_routes.router, prefix="/api/agents", tags=["agents"])


@app.get("/")
def read_root():
    return {
        "message": "CAPTOR Backend API", 
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}