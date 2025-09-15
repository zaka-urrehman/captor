"""
Chat controller - Business logic for chat session operations.
"""
from typing import List, Optional
from fastapi import HTTPException, status
from sqlmodel import Session, select
from pydantic import BaseModel

from src.models.chat import ChatSession, ChatSessionCreate, ChatSessionRead, Message, MessageRead, MessageCreate, AgentOutput, AgentOutputRead
from src.models.customer import Customer, CustomerCreate, CustomerRead
from src.models.data_schema import CollectedData, CollectedDataRead, AgentDataField
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


class CollectedDataItem(BaseModel):
    """Model for individual collected data items."""
    session_id: int
    field_id: int
    answer: str


class AppendAiMessageWithDataRequest(BaseModel):
    """Request model for append-ai-message-with-data endpoint."""
    content: str
    session_id: int
    collected_data: Optional[List[CollectedDataItem]] = None
    session_closed: Optional[bool] = False


class AppendUserMessageRequest(BaseModel):
    """Request model for append-user-message endpoint."""
    content: str
    session_id: int


class AppendUserMessageResponse(BaseModel):
    """Response model for append-user-message endpoint."""
    message: MessageRead


class AppendAiMessageRequest(BaseModel):
    """Request model for append-ai-message endpoint."""
    content: str
    session_id: int
    session_closed: Optional[bool] = False


class AppendAiMessageResponse(BaseModel):
    """Response model for append-ai-message endpoint."""
    message: MessageRead


class AppendAiMessageWithDataResponse(BaseModel):
    """Response model for append-message-with-data endpoint."""
    message: MessageRead
    collected_data: List[CollectedDataRead]


class ConversationWithAgent(BaseModel):
    """Model for conversation with agent details."""
    id: int
    agent_id: int
    started_at: Optional[str] = None
    ended_at: Optional[str] = None
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    session_closed: bool
    created_at: str
    updated_at: Optional[str] = None

    # Agent information
    agent_name: str
    agent_description: Optional[str] = None
    agent_webhook_url: Optional[str] = None
    agent_chat_url: Optional[str] = None


class GetConversationsResponse(BaseModel):
    """Response model for get-conversations endpoint."""
    conversations: List[ConversationWithAgent]


class GetSessionDetailsRequest(BaseModel):
    """Request model for get-session-details endpoint."""
    session_id: int


class GetSessionDetailsResponse(BaseModel):
    """Response model for get-session-details endpoint."""
    session: ChatSessionRead
    messages: List[MessageRead]
    collected_data: List[CollectedDataRead]


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

    @staticmethod
    def append_ai_message_with_data(
        session: Session,
        content: str,
        session_id: int,
        collected_data: Optional[List[dict]] = None,
        session_closed: Optional[bool] = False
    ) -> AppendAiMessageWithDataResponse:
        """Append an AI message and collected data to an existing session. This endpoint is used by n8n, not our frontend."""

        # Validate that session exists
        chat_session = session.get(ChatSession, session_id)
        if not chat_session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found"
            )

        # Create the message with default sender and receiver for AI
        message = Message(
            session_id=session_id,
            sender="Assistant",
            receiver="User",
            content=content
        )
        session.add(message)

        # If session_closed is True, mark the session as closed
        if session_closed:
            chat_session.session_closed = True

        session.commit()
        session.refresh(message)

        # Create collected data if provided
        collected_data_objects = []
        if collected_data:
            for data_item in collected_data:
                # Validate that the field exists
                field = session.get(AgentDataField, data_item.field_id)
                if field:
                    collected_data_obj = CollectedData(
                        session_id=data_item.session_id,
                        field_id=data_item.field_id,
                        answer=data_item.answer
                    )
                    session.add(collected_data_obj)
                    collected_data_objects.append(collected_data_obj)

            session.commit()

            # Refresh all collected data objects
            for data_obj in collected_data_objects:
                session.refresh(data_obj)

        # Convert to response models
        message_read = MessageRead(
            id=message.id,
            session_id=message.session_id,
            sender=message.sender,
            receiver=message.receiver,
            content=message.content,
            created_at=message.created_at.isoformat()
        )

        collected_data_read = []
        for data in collected_data_objects:
            collected_data_read.append(CollectedDataRead(
                id=data.id,
                session_id=data.session_id,
                field_id=data.field_id,
                answer=data.answer,
                created_at=data.created_at.isoformat()
            ))

        return AppendAiMessageWithDataResponse(
            message=message_read,
            collected_data=collected_data_read
        )

    @staticmethod
    def append_user_message(
        session: Session,
        content: str,
        session_id: int
    ) -> AppendUserMessageResponse:
        """Append a user message to an existing session. Used by n8n"""

        # Validate that session exists
        chat_session = session.get(ChatSession, session_id)
        if not chat_session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found"
            )

        # Create the message with default sender and receiver
        message = Message(
            session_id=session_id,
            sender="User",
            receiver="Assistant",
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

        return AppendUserMessageResponse(
            message=message_read
        )

    @staticmethod
    def append_ai_message(
        session: Session,
        content: str,
        session_id: int,
        session_closed: Optional[bool] = False
    ) -> AppendAiMessageResponse:
        """Append an AI message to an existing session. Used by n8n"""

        # Validate that session exists
        chat_session = session.get(ChatSession, session_id)
        if not chat_session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found"
            )

        # Create the message with default sender and receiver for AI
        message = Message(
            session_id=session_id,
            sender="Assistant",
            receiver="User",
            content=content
        )
        session.add(message)

        # If session_closed is True, mark the session as closed
        if session_closed:
            chat_session.session_closed = True

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

        return AppendAiMessageResponse(
            message=message_read
        )

    @staticmethod
    def get_conversations(session: Session, user_id: int) -> GetConversationsResponse:
        """Get all chat sessions for a user's agents."""

        # Get all agents for the user with their sessions
        from src.models.agent import Agent
        agents = session.exec(
            select(Agent).where(Agent.user_id == user_id)
        ).all()

        # Get all sessions for these agents
        agent_ids = [agent.id for agent in agents]
        if not agent_ids:
            return GetConversationsResponse(conversations=[])

        chat_sessions = session.exec(
            select(ChatSession).where(ChatSession.agent_id.in_(agent_ids))
        ).all()

        # Create a mapping of agent_id to agent for quick lookup
        agent_map = {agent.id: agent for agent in agents}

        # Convert to response models with agent information
        conversations = []
        for chat_session in chat_sessions:
            agent = agent_map.get(chat_session.agent_id)
            if agent:
                conversation = ConversationWithAgent(
                    id=chat_session.id,
                    agent_id=chat_session.agent_id,
                    started_at=chat_session.started_at.isoformat() if chat_session.started_at else None,
                    ended_at=chat_session.ended_at.isoformat() if chat_session.ended_at else None,
                    customer_name=chat_session.customer_name,
                    customer_email=chat_session.customer_email,
                    session_closed=chat_session.session_closed,
                    created_at=chat_session.created_at.isoformat(),
                    updated_at=chat_session.updated_at.isoformat() if chat_session.updated_at else None,
                    # Agent information
                    agent_name=agent.name,
                    agent_description=agent.description,
                    agent_webhook_url=agent.webhook_url,
                    agent_chat_url=agent.chat_url
                )
                conversations.append(conversation)

        return GetConversationsResponse(conversations=conversations)

    @staticmethod
    def get_session_details(session: Session, session_id: int) -> GetSessionDetailsResponse:
        """Get all messages and collected data for a specific session."""

        # Get the chat session
        chat_session = session.get(ChatSession, session_id)
        if not chat_session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found"
            )

        # Get all messages for this session
        messages = session.exec(
            select(Message).where(Message.session_id == session_id).order_by(Message.created_at)
        ).all()

        # Get all collected data for this session
        collected_data = session.exec(
            select(CollectedData).where(CollectedData.session_id == session_id)
        ).all()

        # Convert session to response model
        session_read = ChatSessionRead(
            id=chat_session.id,
            agent_id=chat_session.agent_id,
            started_at=chat_session.started_at.isoformat() if chat_session.started_at else None,
            ended_at=chat_session.ended_at.isoformat() if chat_session.ended_at else None,
            customer_name=chat_session.customer_name,
            customer_email=chat_session.customer_email,
            session_closed=chat_session.session_closed,
            created_at=chat_session.created_at.isoformat(),
            updated_at=chat_session.updated_at.isoformat() if chat_session.updated_at else None
        )

        # Convert messages to response models
        messages_read = []
        for message in messages:
            message_read = MessageRead(
                id=message.id,
                session_id=message.session_id,
                sender=message.sender,
                receiver=message.receiver,
                content=message.content,
                created_at=message.created_at.isoformat()
            )
            messages_read.append(message_read)

        # Convert collected data to response models
        collected_data_read = []
        for data in collected_data:
            data_read = CollectedDataRead(
                id=data.id,
                session_id=data.session_id,
                field_id=data.field_id,
                answer=data.answer,
                created_at=data.created_at.isoformat()
            )
            collected_data_read.append(data_read)

        return GetSessionDetailsResponse(
            session=session_read,
            messages=messages_read,
            collected_data=collected_data_read
        )
