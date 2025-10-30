from pymongo import MongoClient
from pymongo.database import Database
import logging
from typing import Optional # <--- ADD THIS LINE


def get_db_connection() -> Optional[Database]:
    
    try:
        from backend.core.config import settings
    except ImportError:
        logging.error("Could not import settings. Check environment setup.")
        return None

    try:
        client = MongoClient(settings.MONGO_URI, serverSelectionTimeoutMS=5000)
        client.server_info()
        logging.info("Successfully connected to MongoDB database: %s", settings.MONGO_DB_NAME)
        db = client[settings.MONGO_DB_NAME]
        return db
    except Exception as e:
        logging.error("ERROR: Could not connect to MongoDB.")
        logging.error("Mongo URI: %s", settings.MONGO_URI)
        logging.error("Error details: %s", str(e))
        return None