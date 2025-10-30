# backend/api/schemas.py (MODIFIED)
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

# --- Request Schema DELETED ---

# --- Response Schemas (No Change) ---

class MatchResult(BaseModel):
    """Schema for a single parameter match result."""
    parameter: str = Field(..., description="Name of the water parameter.")
    matched_value: str = Field(..., description="The reference chart value that was the closest match.")
    unit: str = Field("ppm", description="The unit of measurement (e.g., ppm, ppb).")
    confidence_score: float = Field(..., description="The Delta E (ΔE) color difference score. Lower is better.")
    matched_hex: Optional[str] = Field(None, description="The HEX color of the matched swatch.")

class AnalysisResponse(BaseModel):
    """Output payload for the /analyze endpoint."""
    strip_id: str = Field(..., description="Unique ID for this analysis run.")
    timestamp: str = Field(..., description="UTC timestamp of the analysis.")
    ai_summary: Optional[str] = Field(None, description="A natural language summary and interpretation of the results by the LLM.")
    results: List[MatchResult]