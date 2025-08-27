"""Agent Routes"""

from typing import Annotated
from fastapi import APIRouter, Depends, Query
from sqlmodel import Session

from src.database import get_session
from src.models.agent import Agent, AgentRead, AgentUpdate, AgentCreate
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