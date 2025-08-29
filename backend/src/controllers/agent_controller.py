"""
Agent controller - Business logic for agent operations.
"""
from typing import List, Optional
from fastapi import HTTPException, status
from sqlmodel import Session, select
from sqlmodel import func
from src.models.agent import Agent, AgentRead, AgentUpdate, AgentCreate
from src.core.responses import APIResponse, success_response, paginated_response, MessageResponse
from src.models.data_schema import AgentDataSchema, AgentDataField, AgentDataSchemaRead, AgentDataFieldRead, AgentDataSchemaUpdate, AgentDataFieldUpdate
from src.models.chat import ChatSession, ChatSessionRead
from src.core.responses import PaginatedResponse

class AgentController:
    """Controller for agent operations."""

    @staticmethod
    def get_agents(session: Session, user_id: int, skip: int = 0, limit: int = 100) -> PaginatedResponse[AgentRead]:
        """Get all agents for a specific user, including their schemas and fields."""

        # Build the statement to fetch agents for the user, eagerly loading data schemas and fields.
        # This ensures all related data is retrieved in a single query.
        statement = (
            select(Agent)
            .where(Agent.user_id == user_id)
            .order_by(Agent.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        agents = session.exec(statement).all()

        # Get total count for pagination
        total_statement = select(func.count(Agent.id)).where(Agent.user_id == user_id)
        total = session.exec(total_statement).one()

        agents_data = []
        for agent in agents:
            agent_data = AgentRead(
                id=agent.id,
                name=agent.name,
                description=agent.description,
                system_prompt=agent.system_prompt,
                user_instructions=agent.user_instructions,
                webhook_url=agent.webhook_url,
                chat_url=agent.chat_url,
                user_id=agent.user_id,
                created_at=agent.created_at.isoformat(),
                updated_at=agent.updated_at.isoformat() if agent.updated_at else None,
                data_schemas=[], # Initialize with empty list
                chat_sessions=[] # Initialize with empty list
            )

            # Manually load data_schemas and fields
            for schema in agent.data_schemas:
                schema_read = AgentDataSchemaRead(
                    id=schema.id,
                    agent_id=schema.agent_id,
                    type=schema.type,
                    created_at=schema.created_at.isoformat(),
                    fields=[] # Initialize with empty list
                )

                for field in schema.fields:
                    field_read = AgentDataFieldRead(
                        id=field.id,
                        schema_id=field.schema_id,
                        key=field.key,
                        question=field.question,
                        data_type=field.data_type,
                        required=field.required,
                        validation_rules=field.validation_rules,
                        created_at=field.created_at.isoformat()
                    )
                    schema_read.fields.append(field_read)

                agent_data.data_schemas.append(schema_read)

            # Manually load chat_sessions
            for session in agent.chat_sessions:
                session_read = ChatSessionRead(
                    id=session.id,
                    agent_id=session.agent_id,
                    customer_name=session.customer_name,
                    customer_email=session.customer_email,
                    started_at=session.started_at.isoformat(),
                    ended_at=session.ended_at.isoformat() if session.ended_at else None,
                    created_at=session.created_at.isoformat(),
                    updated_at=session.updated_at.isoformat() if session.updated_at else None
                )
                agent_data.chat_sessions.append(session_read)

            agents_data.append(agent_data)
        
        return paginated_response(
            data=agents_data,
            total=total,
            page=(skip // limit) + 1,
            page_size=limit,
            message="Agents retrieved successfully"
        )
    
    @staticmethod
    def create_agent(session: Session, agent_create: AgentCreate, user_id: int) -> APIResponse[AgentRead]:
        """Create a new agent."""

        # 1. Create the Agent
        agent = Agent(
            name=agent_create.name,
            description=agent_create.description,
            user_id=user_id,
            system_prompt=agent_create.system_prompt,
            user_instructions=agent_create.user_instructions,
            webhook_url=agent_create.webhook_url
            # chat_url is intentionally left out - will be null initially
        )
        session.add(agent)
        session.commit()
        session.refresh(agent)  # Now we have agent.id

        # 2. Create the AgentDataSchema linked to this Agent
        agent_data_schema = AgentDataSchema(
            agent_id=agent.id,
            type=agent_create.type,
        )
        session.add(agent_data_schema)
        session.commit()
        session.refresh(agent_data_schema)  # Now we have schema.id

        # 3. Create the AgentDataFields linked to the schema
        for field in agent_create.agent_data_fields:
            agent_data_field = AgentDataField(
                schema_id=agent_data_schema.id,
                key=field.key,
                question=field.question,
                data_type=field.data_type,
                required=field.required,
                validation_rules=field.validation_rules
            )
            session.add(agent_data_field)

        session.commit()
        # session.refresh(agent_data_field)

        # 4. Refresh agent to load relationships and return agent details with schema/fields
        session.refresh(agent)

        agent_data = AgentRead(
            id=agent.id,
            name=agent.name,
            description=agent.description,
            system_prompt=agent.system_prompt,
            user_instructions=agent.user_instructions,
            webhook_url=agent.webhook_url,
            chat_url=agent.chat_url,
            user_id=agent.user_id,
            created_at=agent.created_at.isoformat(),
            updated_at=agent.updated_at.isoformat() if agent.updated_at else None,
            data_schemas=[], # Initialize with empty list
            chat_sessions=[] # Initialize with empty list
        )

        # Populate data_schemas and fields
        for schema in agent.data_schemas:
            schema_read = AgentDataSchemaRead(
                id=schema.id,
                agent_id=schema.agent_id,
                type=schema.type,
                created_at=schema.created_at.isoformat(),
                fields=[] # Initialize with empty list
            )

            for field in schema.fields:
                field_read = AgentDataFieldRead(
                    id=field.id,
                    schema_id=field.schema_id,
                    key=field.key,
                    question=field.question,
                    data_type=field.data_type,
                    required=field.required,
                    validation_rules=field.validation_rules,
                    created_at=field.created_at.isoformat()
                )
                schema_read.fields.append(field_read)

            agent_data.data_schemas.append(schema_read)

        # Populate chat_sessions (initially empty for new agent)
        for session in agent.chat_sessions:
            session_read = ChatSessionRead(
                id=session.id,
                agent_id=session.agent_id,
                customer_name=session.customer_name,
                customer_email=session.customer_email,
                started_at=session.started_at.isoformat(),
                ended_at=session.ended_at.isoformat() if session.ended_at else None,
                created_at=session.created_at.isoformat(),
                updated_at=session.updated_at.isoformat() if session.updated_at else None
            )
            agent_data.chat_sessions.append(session_read)

        return success_response(
            data=agent_data,
            message="Agent created successfully"
        )

    @staticmethod
    def update_agent(session: Session, agent_id: int, agent_update: AgentUpdate) -> APIResponse[AgentRead]:
        """Update agent information."""
        agent = session.get(Agent, agent_id)
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agent not found"
            )
        
        # Update agent fields
        update_data = agent_update.model_dump(exclude_unset=True)        
        for field, value in update_data.items():
            if field not in ["type", "agent_data_fields"]:
                setattr(agent, field, value)
        
        session.add(agent)  
        session.commit()
        session.refresh(agent)

        # Update associated AgentDataSchema if type is provided
        if agent_update.type is not None:
            # Assuming an agent has only one data schema for now
            agent_data_schema = session.exec(select(AgentDataSchema).where(AgentDataSchema.agent_id == agent.id)).first()
            if agent_data_schema:
                agent_data_schema.type = agent_update.type
                session.add(agent_data_schema)
                session.commit()
                session.refresh(agent_data_schema)

        # Update or create AgentDataFields
        if agent_update.agent_data_fields is not None and agent.data_schemas:
            current_schema = agent.data_schemas[0] # Assuming one schema per agent
            for field_update in agent_update.agent_data_fields:
                if field_update.id is not None: # Update existing field
                    agent_data_field = session.get(AgentDataField, field_update.id)
                    if agent_data_field and agent_data_field.schema_id == current_schema.id:
                        field_data = field_update.model_dump(exclude_unset=True)
                        # Exclude schema_id from updates since it should never be changed
                        field_data = {k: v for k, v in field_data.items() if k != 'schema_id'}
                        for key, value in field_data.items():
                            setattr(agent_data_field, key, value)
                        session.add(agent_data_field)
                        session.commit()
                        session.refresh(agent_data_field)
                else: # Create new field
                    new_field = AgentDataField(
                        schema_id=current_schema.id,
                        **field_update.model_dump(exclude_unset=True)
                    )
                    session.add(new_field)
                    session.commit()
                    session.refresh(new_field)

        session.refresh(agent) # Refresh agent to load updated relationships
        
        agent_data = AgentRead(
            id=agent.id,
            name=agent.name,
            description=agent.description,
            system_prompt=agent.system_prompt,
            user_instructions=agent.user_instructions,
            webhook_url=agent.webhook_url,
            chat_url=agent.chat_url,
            user_id=agent.user_id,
            created_at=agent.created_at.isoformat(),
            updated_at=agent.updated_at.isoformat() if agent.updated_at else None,
            data_schemas=[], # Re-initialize to populate with fresh data
            chat_sessions=[] # Re-initialize to populate with fresh data
        )

        for schema in agent.data_schemas:
            schema_read = AgentDataSchemaRead(
                id=schema.id,
                agent_id=schema.agent_id,
                type=schema.type,
                created_at=schema.created_at.isoformat(),
                fields=[]
            )
            for field in schema.fields:
                field_read = AgentDataFieldRead(
                    id=field.id,
                    schema_id=field.schema_id,
                    key=field.key,
                    question=field.question,
                    data_type=field.data_type,
                    required=field.required,
                    validation_rules=field.validation_rules,
                    created_at=field.created_at.isoformat()
                )
                schema_read.fields.append(field_read)
            agent_data.data_schemas.append(schema_read)

        # Populate chat_sessions
        for session in agent.chat_sessions:
            session_read = ChatSessionRead(
                id=session.id,
                agent_id=session.agent_id,
                customer_name=session.customer_name,
                customer_email=session.customer_email,
                started_at=session.started_at.isoformat(),
                ended_at=session.ended_at.isoformat() if session.ended_at else None,
                created_at=session.created_at.isoformat(),
                updated_at=session.updated_at.isoformat() if session.updated_at else None
            )
            agent_data.chat_sessions.append(session_read)

        return success_response(
            data=agent_data,
            message="Agent updated successfully"
        )
    
    @staticmethod
    def delete_agent(session: Session, agent_id: int) -> MessageResponse:
        """Delete agent."""
        agent = session.get(Agent, agent_id)
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agent not found"
            )
        
        # Delete associated data schemas and fields
        for schema in agent.data_schemas:
            for field in schema.fields:
                session.delete(field)
            session.delete(schema)
        
        session.delete(agent)
        session.commit()
        
        return MessageResponse.success_message("Agent deleted successfully")

    @staticmethod
    def get_agent_by_chat_url(session: Session, chat_url: str) -> APIResponse[AgentRead]:
        """Get agent by chat URL."""
        agent = session.exec(select(Agent).where(Agent.chat_url == chat_url)).first()
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agent not found"
            )

        agent_data = AgentRead(
            id=agent.id,
            name=agent.name,
            description=agent.description,
            system_prompt=agent.system_prompt,
            user_instructions=agent.user_instructions,
            webhook_url=agent.webhook_url,
            chat_url=agent.chat_url,
            user_id=agent.user_id,
            created_at=agent.created_at.isoformat(),
            updated_at=agent.updated_at.isoformat() if agent.updated_at else None,
            data_schemas=[], # Initialize with empty list
            chat_sessions=[] # Initialize with empty list
        )

        # Populate data_schemas and fields
        for schema in agent.data_schemas:
            schema_read = AgentDataSchemaRead(
                id=schema.id,
                agent_id=schema.agent_id,
                type=schema.type,
                created_at=schema.created_at.isoformat(),
                fields=[] # Initialize with empty list
            )

            for field in schema.fields:
                field_read = AgentDataFieldRead(
                    id=field.id,
                    schema_id=field.schema_id,
                    key=field.key,
                    question=field.question,
                    data_type=field.data_type,
                    required=field.required,
                    validation_rules=field.validation_rules,
                    created_at=field.created_at.isoformat()
                )
                schema_read.fields.append(field_read)

            agent_data.data_schemas.append(schema_read)

        # Populate chat_sessions
        for session in agent.chat_sessions:
            session_read = ChatSessionRead(
                id=session.id,
                agent_id=session.agent_id,
                customer_name=session.customer_name,
                customer_email=session.customer_email,
                started_at=session.started_at.isoformat(),
                ended_at=session.ended_at.isoformat() if session.ended_at else None,
                created_at=session.created_at.isoformat(),
                updated_at=session.updated_at.isoformat() if session.updated_at else None
            )
            agent_data.chat_sessions.append(session_read)

        return success_response(
            data=agent_data,
            message="Agent retrieved successfully"
        )

    @staticmethod
    def add_chat_url(session: Session, agent_id: int, chat_url: str, user_id: int) -> APIResponse[AgentRead]:
        """Add chat URL to an agent."""
        agent = session.get(Agent, agent_id)
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agent not found"
            )

        # Check if the agent belongs to the authenticated user
        if agent.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to modify this agent"
            )

        # Check if chat_url is already taken by another agent
        existing_agent = session.exec(select(Agent).where(Agent.chat_url == chat_url)).first()
        if existing_agent and existing_agent.id != agent_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Chat URL is already in use by another agent"
            )

        agent.chat_url = chat_url
        session.add(agent)
        session.commit()
        session.refresh(agent)

        # Return updated agent data
        agent_data = AgentRead(
            id=agent.id,
            name=agent.name,
            description=agent.description,
            system_prompt=agent.system_prompt,
            user_instructions=agent.user_instructions,
            webhook_url=agent.webhook_url,
            chat_url=agent.chat_url,
            user_id=agent.user_id,
            created_at=agent.created_at.isoformat(),
            updated_at=agent.updated_at.isoformat() if agent.updated_at else None,
            data_schemas=[], # Initialize with empty list
            chat_sessions=[] # Initialize with empty list
        )

        # Populate data_schemas and fields
        for schema in agent.data_schemas:
            schema_read = AgentDataSchemaRead(
                id=schema.id,
                agent_id=schema.agent_id,
                type=schema.type,
                created_at=schema.created_at.isoformat(),
                fields=[] # Initialize with empty list
            )

            for field in schema.fields:
                field_read = AgentDataFieldRead(
                    id=field.id,
                    schema_id=field.schema_id,
                    key=field.key,
                    question=field.question,
                    data_type=field.data_type,
                    required=field.required,
                    validation_rules=field.validation_rules,
                    created_at=field.created_at.isoformat()
                )
                schema_read.fields.append(field_read)

            agent_data.data_schemas.append(schema_read)

        # Populate chat_sessions
        for session in agent.chat_sessions:
            session_read = ChatSessionRead(
                id=session.id,
                agent_id=session.agent_id,
                customer_name=session.customer_name,
                customer_email=session.customer_email,
                started_at=session.started_at.isoformat(),
                ended_at=session.ended_at.isoformat() if session.ended_at else None,
                created_at=session.created_at.isoformat(),
                updated_at=session.updated_at.isoformat() if session.updated_at else None
            )
            agent_data.chat_sessions.append(session_read)

        return success_response(
            data=agent_data,
            message="Chat URL added successfully"
        )

    @staticmethod
    def remove_chat_url(session: Session, agent_id: int, user_id: int) -> APIResponse[AgentRead]:
        """Remove chat URL from an agent."""
        agent = session.get(Agent, agent_id)
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agent not found"
            )

        # Check if the agent belongs to the authenticated user
        if agent.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to modify this agent"
            )

        agent.chat_url = None
        session.add(agent)
        session.commit()
        session.refresh(agent)

        # Return updated agent data
        agent_data = AgentRead(
            id=agent.id,
            name=agent.name,
            description=agent.description,
            system_prompt=agent.system_prompt,
            user_instructions=agent.user_instructions,
            webhook_url=agent.webhook_url,
            chat_url=agent.chat_url,
            user_id=agent.user_id,
            created_at=agent.created_at.isoformat(),
            updated_at=agent.updated_at.isoformat() if agent.updated_at else None,
            data_schemas=[], # Initialize with empty list
            chat_sessions=[] # Initialize with empty list
        )

        # Populate data_schemas and fields
        for schema in agent.data_schemas:
            schema_read = AgentDataSchemaRead(
                id=schema.id,
                agent_id=schema.agent_id,
                type=schema.type,
                created_at=schema.created_at.isoformat(),
                fields=[] # Initialize with empty list
            )

            for field in schema.fields:
                field_read = AgentDataFieldRead(
                    id=field.id,
                    schema_id=field.schema_id,
                    key=field.key,
                    question=field.question,
                    data_type=field.data_type,
                    required=field.required,
                    validation_rules=field.validation_rules,
                    created_at=field.created_at.isoformat()
                )
                schema_read.fields.append(field_read)

            agent_data.data_schemas.append(schema_read)

        # Populate chat_sessions
        for session in agent.chat_sessions:
            session_read = ChatSessionRead(
                id=session.id,
                agent_id=session.agent_id,
                customer_name=session.customer_name,
                customer_email=session.customer_email,
                started_at=session.started_at.isoformat(),
                ended_at=session.ended_at.isoformat() if session.ended_at else None,
                created_at=session.created_at.isoformat(),
                updated_at=session.updated_at.isoformat() if session.updated_at else None
            )
            agent_data.chat_sessions.append(session_read)

        return success_response(
            data=agent_data,
            message="Chat URL removed successfully"
        )

