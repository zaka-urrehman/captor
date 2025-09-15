"""Agent Routes"""

from typing import Annotated
from fastapi import APIRouter, Depends, Query
from sqlmodel import Session

from src.database import get_session
from src.models.agent import Agent, AgentRead, AgentUpdate, AgentCreate, AgentChatUrlUpdate
from src.models.user import User
from src.core.dependencies import get_current_active_user
from src.controllers.agent_controller import AgentController
from src.core.responses import APIResponse, PaginatedResponse, MessageResponse



router = APIRouter()

@router.get("/", response_model=PaginatedResponse[AgentRead])
def get_agents(
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_active_user)],
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100)
):
    """Get list of agents."""
    return AgentController.get_agents(session, user_id=current_user.id, skip=skip, limit=limit)


@router.post("/create-agent", response_model=APIResponse[AgentRead])
def create_agent(
    agent_create_data: AgentCreate,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    """Create a new agent."""
    return AgentController.create_agent(session, agent_create_data, current_user.id)


@router.get("/{agent_id}", response_model=APIResponse[AgentRead])
def get_agent_by_id(
    agent_id: int,
    session: Annotated[Session, Depends(get_session)]
):
    """Get agent by ID (public endpoint)."""
    return AgentController.get_agent_by_id(session, agent_id)


@router.put("/{agent_id}", response_model=APIResponse[AgentRead])
def update_agent(
    agent_id: int,
    agent_update_data: AgentUpdate,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    """Update agent by ID."""
    return AgentController.update_agent(session, agent_id, agent_update_data)


@router.delete("/{agent_id}", response_model=MessageResponse)
def delete_agent(
    agent_id: int,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    """Delete agent by ID."""
    return AgentController.delete_agent(session, agent_id)


@router.get("/by-chat-url/{chat_url}", response_model=APIResponse[AgentRead])
def get_agent_by_chat_url(
    chat_url: str,
    session: Annotated[Session, Depends(get_session)]
):
    """Get agent by chat URL."""
    return AgentController.get_agent_by_chat_url(session, chat_url)


@router.post("/{agent_id}/add-chat-url", response_model=APIResponse[AgentRead])
def add_chat_url(
    agent_id: int,
    chat_url_data: AgentChatUrlUpdate,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    """Add chat URL to an agent."""
    return AgentController.add_chat_url(session, agent_id, chat_url_data.chat_url, current_user.id)


@router.delete("/{agent_id}/chat-url", response_model=APIResponse[AgentRead])
def remove_chat_url(
    agent_id: int,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    """Remove chat URL from an agent."""
    return AgentController.remove_chat_url(session, agent_id, current_user.id)