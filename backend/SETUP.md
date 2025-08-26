# CAPTOR Backend Setup Guide

## Prerequisites

- Python 3.12+
- UV package manager
- PostgreSQL database

## Installation

1. **Install dependencies**:
   ```bash
   uv sync
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure your database connection:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/captor_db
   SECRET_KEY=your-super-secret-key-change-this-in-production
   ```

3. **Create database**:
   ```sql
   CREATE DATABASE captor_db;
   ```

4. **Run the application**:
   ```bash
   uv run fastapi run src/main.py --reload
   ```

   The application will automatically create all database tables on startup.

## Project Structure

```
backend/
├── src/
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py          # Application settings
│   ├── database/
│   │   ├── __init__.py
│   │   └── connection.py      # Database connection
│   ├── models/
│   │   ├── __init__.py        # Model exports
│   │   ├── base.py            # Base model classes
│   │   ├── user.py            # User models
│   │   ├── agent.py           # Agent models
│   │   ├── customer.py        # Customer models
│   │   ├── chat.py            # Chat and message models
│   │   └── data_schema.py     # Dynamic data schema models
│   └── main.py                # FastAPI application
├── .env.example              # Environment variables template
├── DATABASE_SCHEMA.md        # Database schema documentation
├── pyproject.toml           # Project dependencies
└── README.md
```

## Database Schema

The database includes the following key tables:

- **users** - SaaS accounts that create agents
- **agents** - AI agents created by users
- **customers** - End-users who interact with agents
- **chat_sessions** - Conversation instances
- **messages** - Individual chat messages
- **agent_outputs** - Structured outputs from agents
- **agent_data_schemas** - Data collection configurations
- **agent_data_fields** - Fields within data schemas
- **collected_data** - Data collected during sessions

## API Endpoints

- `GET /` - API status and version
- `GET /health` - Health check endpoint

Additional CRUD endpoints will be added in the next phase.

## Next Steps

1. Set up PostgreSQL database connection
2. Implement authentication system
3. Create CRUD operations for each model
4. Add API endpoints for agent interactions
5. Implement webhook integrations for n8n

## Development

To run in development mode:
```bash
uv run fastapi dev src/main.py
```

The application includes automatic table creation and supports hot reloading for development.
