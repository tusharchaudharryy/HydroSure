# backend/services/llm_service.py
import logging
from openai import OpenAI
from typing import List, Dict, Any, Optional
from backend.core.config import settings

# Initialize the client once here
try:
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
except Exception as e:
    logging.error(f"Failed to initialize OpenAI client: {e}")
    client = None

def get_interpretation_summary(results: List[Dict[str, Any]]) -> Optional[str]:
    """
    Sends the final structured results to an LLM for a human-readable summary.
    """
    if not client:
        logging.error("LLM Service: OpenAI client not initialized. Skipping interpretation.")
        return "Analysis summary is unavailable due to a service error."

    logging.info("LLM Service: Starting result interpretation...")
    
    # Format the results into a clean, text-based table/list for the LLM
    result_text = "\n".join([
        f"- {r.get('parameter', 'N/A')}: {r.get('matched_value', 'N/A')} {r.get('unit', '')}"
        for r in results
    ])
    
    prompt = (
        "You are an expert water quality analyst providing a summary for a home user. "
        "Review the following test results and provide a concise, friendly, 2-3 sentence summary "
        "of the water quality. Highlight 1-2 major points (good or bad). "
        "Do not use highly technical language or mention confidence/error scores. "
        "Focus on the water's suitability for general household use.\n\n"
        "--- TEST RESULTS ---\n"
        f"{result_text}"
    )

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo", # Cheaper model for simple text summary
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=300
        )
        return response.choices[0].message.content
        
    except Exception as e:
        logging.error("LLM Service: Interpretation failed: %s", str(e))
        return "Analysis summary is unavailable due to a service error."