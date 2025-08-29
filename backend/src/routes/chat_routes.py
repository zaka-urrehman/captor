"""Chat Routes"""

from fastapi import APIRouter, Depends
from sqlmodel import Session

from src.database import get_session
from src.controllers.chat_controller import (
    ChatController,
    GetOrCreateSessionRequest,
    GetOrCreateSessionResponse,
    AppendFirstMessageRequest,
    AppendFirstMessageResponse
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
    """Append a message to an existing session."""
    return ChatController.append_first_message(
        session=session,
        sender=request.sender,
        receiver=request.receiver,
        content=request.content,
        session_id=request.session_id
    )
