import logging
from typing import List, Dict, Any
from backend.utils.db import get_db_connection
from backend.models.db_models import ChartReference

def load_chart_reference() -> List[ChartReference]:
    """
    Fetches the static chart reference data (parameter names, values, LAB colors) 
    from MongoDB.
    """
    db = get_db_connection()
    if db is None:
        logging.error("Chart Service: Failed to get DB connection.")
        return []

    try:
        collection = db["chart_reference"]
        chart_data_dicts = list(collection.find({}))
        
        if not chart_data_dicts:
            logging.error("Chart Service: No reference data found in 'chart_reference' collection.")
            return []
            
        chart_references = [ChartReference(**doc) for doc in chart_data_dicts]
        
        logging.info("Chart Service: Successfully loaded %d parameter rows.", len(chart_references))
        return chart_references
        
    except Exception as e:
        logging.error("Chart Service: Error fetching or parsing data: %s", str(e))
        return []