# backend/api/schemas.py
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

# --- Request Schema (We don't use this for file uploads) ---
# AnalysisRequest is no longer needed

# --- Response Schemas ---

class MatchResult(BaseModel):
    """Schema for a single parameter match result."""
    parameter: str = Field(..., description="Name of the water parameter.")
    matched_value: str = Field(..., description="The reference chart value that was the closest match.")
    unit: str = Field("ppm", description="The unit of measurement (e.g., ppm, ppb).")
    confidence_score: float = Field(..., description="The Delta E (ΔE) color difference score. 0.0 for LLM.")
    matched_hex: Optional[str] = Field(None, description="The HEX color of the matched swatch.")

class AnalysisResponse(BaseModel):
    """Output payload for the /analyze endpoint."""
    strip_id: str = Field(..., description="Unique ID for this analysis run.")
    timestamp: str = Field(..., description="UTC timestamp of the analysis.")
    
    # --- NEW FIELD ---
    location_summary: Optional[str] = Field(None, description="A brief summary of the test location, if provided.")
    
    ai_summary: Optional[str] = Field(None, description="A natural language summary and interpretation of the results by the LLM.")
    results: List[MatchResult]