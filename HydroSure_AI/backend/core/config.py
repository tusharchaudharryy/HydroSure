import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings


load_dotenv()

class Settings(BaseSettings):
    """Holds all application settings."""
    
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    MONGO_URI: str = os.getenv("MONGO_URI", "")
    MONGO_DB_NAME: str = os.getenv("MONGO_DB_NAME", "hydro_sure_db")
    
    FASTAPI_API_KEY: str = os.getenv("FASTAPI_API_KEY", "")

    class Config:
        case_sensitive = True

settings = Settings()

if not settings.OPENAI_API_KEY:
    print("WARNING: OPENAI_API_KEY is not set.")
if not settings.MONGO_URI:
    print("WARNING: MONGO_URI is not set.")
if not settings.FASTAPI_API_KEY:
    print("WARNING: FASTAPI_API_KEY is not set.")