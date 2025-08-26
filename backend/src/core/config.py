"""
Configuration settings for the application.
"""
import os
from dotenv import load_dotenv
from starlette.config import Config
from starlette.datastructures import Secret

# Load .env file explicitly
load_dotenv()

try:
    config = Config(".env")
except FileNotFoundError:
    config = Config()

# Database
DATABASE_URL = config("DATABASE_URL", cast=Secret, default="postgresql://postgres:password@localhost:5432/captor_db")

# Security
SECRET_KEY = config("SECRET_KEY", cast=Secret, default="super-secret-key-change-this-in-production")
ALGORITHM = config("ALGORITHM", cast=str, default="HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = config("ACCESS_TOKEN_EXPIRE_MINUTES", cast=int, default=60)

# Application
APP_NAME = config("APP_NAME", cast=str, default="CAPTOR Backend")
DEBUG = config("DEBUG", cast=bool, default=True)
