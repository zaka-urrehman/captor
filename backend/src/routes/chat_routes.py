"""Chat Routes"""

from fastapi import APIRouter, Depends
from sqlmodel import Session
from typing import Annotated

from src.database import get_session
from src.models.user import User
from src.core.dependencies import get_current_active_user
from src.controllers.chat_controller import (
    ChatController,
    GetOrCreateSessionRequest,
    GetOrCreateSessionResponse,
    AppendFirstMessageRequest,
    AppendFirstMessageResponse,
    AppendAiMessageRequest,
    AppendAiMessageResponse,
    AppendAiMessageWithDataRequest,
    AppendAiMessageWithDataResponse,
    AppendUserMessageRequest,
    AppendUserMessageResponse,
    ConversationWithAgent,
    GetConversationsResponse,
    GetSessionDetailsRequest,
    GetSessionDetailsResponse,
    CollectedDataItem
)


router = APIRouter()


@router.post("/get-or-create-session", response_model=GetOrCreateSessionResponse)
def get_or_create_session(
    request: GetOrCreateSessionRequest,
    session: Session = Depends(get_session)
):
    """Get existing session or create new customer and session."""
    return ChatController.get_or_create_session(
        session=session,
        agent_id=request.agent_id,
        customer_name=request.customer_name,
        customer_email=request.customer_email
    )


@router.post("/append-first-message", response_model=AppendFirstMessageResponse)
def append_first_message(
    request: AppendFirstMessageRequest,
    session: Session = Depends(get_session)
):
    """Append a message to an existing session (public endpoint)."""
    return ChatController.append_first_message(
        session=session,
        sender=request.sender,
        receiver=request.receiver,
        content=request.content,
        session_id=request.session_id
    )


@router.post("/append-ai-message-with-data", response_model=AppendAiMessageWithDataResponse)
def append_ai_message_with_data(
    request: AppendAiMessageWithDataRequest,
    session: Session = Depends(get_session)
):
    """Append an AI message and collected data to an existing session (public endpoint)."""
    return ChatController.append_ai_message_with_data(
        session=session,
        content=request.content,
        session_id=request.session_id,
        collected_data=request.collected_data,
        session_closed=request.session_closed
    )


@router.post("/append-ai-message", response_model=AppendAiMessageResponse)
def append_ai_message(
    request: AppendAiMessageRequest,
    session: Session = Depends(get_session)
):
    """Append an AI message to an existing session (public endpoint)."""
    return ChatController.append_ai_message(
        session=session,
        content=request.content,
        session_id=request.session_id,
        session_closed=request.session_closed
    )


@router.post("/append-user-message", response_model=AppendUserMessageResponse)
def append_user_message(
    request: AppendUserMessageRequest,
    session: Session = Depends(get_session)
):
    """Append a user message to an existing session (public endpoint)."""
    return ChatController.append_user_message(
        session=session,
        content=request.content,
        session_id=request.session_id
    )


@router.get("/get-conversations", response_model=GetConversationsResponse)
def get_conversations(
    current_user: Annotated[User, Depends(get_current_active_user)],
    session: Session = Depends(get_session)
):
    """Get all chat sessions for the current user's agents (authenticated endpoint)."""
    return ChatController.get_conversations(
        session=session,
        user_id=current_user.id
    )


@router.post("/get-session-details", response_model=GetSessionDetailsResponse)
def get_session_details(
    request: GetSessionDetailsRequest,
    session: Session = Depends(get_session)
):
    """Get all messages and collected data for a specific session (public endpoint)."""
    return ChatController.get_session_details(
        session=session,
        session_id=request.session_id
    )
