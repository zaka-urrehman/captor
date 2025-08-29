"""
Chat controller - Business logic for chat session operations.
"""
from typing import List, Optional
from fastapi import HTTPException, status
from sqlmodel import Session, select
from pydantic import BaseModel

from src.models.chat import ChatSession, ChatSessionCreate, ChatSessionRead, Message, MessageRead, MessageCreate, AgentOutput, AgentOutputRead
from src.models.customer import Customer, CustomerCreate, CustomerRead
from src.models.data_schema import CollectedData, CollectedDataRead
from src.models.agent import Agent
from src.core.responses import APIResponse, success_response, MessageResponse


class GetOrCreateSessionRequest(BaseModel):
    """Request model for get-or-create-session endpoint."""
    agent_id: int
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None


class GetOrCreateSessionResponse(BaseModel):
    """Response model for get-or-create-session endpoint."""
    customer: CustomerRead
    session: ChatSessionRead
    messages: List[MessageRead]
    collected_data: List[CollectedDataRead]
    is_new_session: bool


class AppendFirstMessageRequest(BaseModel):
    """Request model for append-first-message endpoint."""
    sender: str
    receiver: str
    content: str
    session_id: int


class AppendFirstMessageResponse(BaseModel):
    """Response model for append-first-message endpoint."""
    message: MessageRead


class ChatController:
    """Controller for chat session operations."""

    @staticmethod
    def get_or_create_session(session: Session, agent_id: int, customer_name: Optional[str] = None, customer_email: Optional[str] = None) -> GetOrCreateSessionResponse:
        """Get existing session or create new customer and session."""

        # Validate that agent exists
        agent = session.get(Agent, agent_id)
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agent not found"
            )

        is_new_session = False

        # Try to find existing customer by email for this agent
        customer = None
        if customer_email:
            customer = session.exec(
                select(Customer).where(
                    Customer.agent_id == agent_id,
                    Customer.email == customer_email
                )
            ).first()

        # If customer doesn't exist, create one
        if not customer:
            customer = Customer(
                agent_id=agent_id,
                name=customer_name,
                email=customer_email
            )
            session.add(customer)
            session.commit()
            session.refresh(customer)

        # Check if there's an active session for this customer
        # For now, we'll get the most recent session or create a new one
        chat_session = session.exec(
            select(ChatSession).where(
                ChatSession.agent_id == agent_id,
                ChatSession.customer_name == customer.name,
                ChatSession.customer_email == customer.email
            ).order_by(ChatSession.created_at.desc())
        ).first()

        if not chat_session:
            # Create new session
            chat_session = ChatSession(
                agent_id=agent_id,
                customer_name=customer.name,
                customer_email=customer.email
            )
            session.add(chat_session)
            session.commit()
            session.refresh(chat_session)
            is_new_session = True

        # Get messages for the session
        messages = session.exec(
            select(Message).where(Message.session_id == chat_session.id)
            .order_by(Message.created_at.asc())
        ).all()

        # Get collected data for the session
        collected_data = session.exec(
            select(CollectedData).where(CollectedData.session_id == chat_session.id)
            .order_by(CollectedData.created_at.asc())
        ).all()

        # Convert to response models
        customer_read = CustomerRead(
            id=customer.id,
            agent_id=customer.agent_id,
            name=customer.name,
            email=customer.email,
            created_at=customer.created_at.isoformat()
        )

        session_read = ChatSessionRead(
            id=chat_session.id,
            agent_id=chat_session.agent_id,
            customer_name=chat_session.customer_name,
            customer_email=chat_session.customer_email,
            started_at=chat_session.started_at.isoformat(),
            ended_at=chat_session.ended_at.isoformat() if chat_session.ended_at else None,
            created_at=chat_session.created_at.isoformat(),
            updated_at=chat_session.updated_at.isoformat() if chat_session.updated_at else None
        )

        messages_read = []
        for message in messages:
            messages_read.append(MessageRead(
                id=message.id,
                session_id=message.session_id,
                sender=message.sender,
                receiver=message.receiver,
                content=message.content,
                created_at=message.created_at.isoformat()
            ))

        collected_data_read = []
        for data in collected_data:
            collected_data_read.append(CollectedDataRead(
                id=data.id,
                session_id=data.session_id,
                field_id=data.field_id,
                answer=data.answer,
                created_at=data.created_at.isoformat()
            ))

        return GetOrCreateSessionResponse(
            customer=customer_read,
            session=session_read,
            messages=messages_read,
            collected_data=collected_data_read,
            is_new_session=is_new_session
        )

    @staticmethod
    def append_first_message(
        session: Session,
        sender: str,
        receiver: str,
        content: str,
        session_id: int
    ) -> AppendFirstMessageResponse:
        """Append a message to an existing session."""

        # Validate that session exists
        chat_session = session.get(ChatSession, session_id)
        if not chat_session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found"
            )

        # Create the message
        message = Message(
            session_id=session_id,
            sender=sender,
            receiver=receiver,
            content=content
        )
        session.add(message)
        session.commit()
        session.refresh(message)

        # Convert to response model
        message_read = MessageRead(
            id=message.id,
            session_id=message.session_id,
            sender=message.sender,
            receiver=message.receiver,
            content=message.content,
            created_at=message.created_at.isoformat()
        )

        return AppendFirstMessageResponse(
            message=message_read
        )
