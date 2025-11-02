# backend/models/db_models.py
from pydantic import BaseModel, Field
from typing import List, Optional

# --- This class is from your previous setup ---
class Swatch(BaseModel):
    """Schema for a single color swatch on the chart."""
    value: str = Field(..., description="The concentration value (e.g., '10', '425').")
    lab_color: List[float] = Field(..., description="The CIELAB color vector [L*, a*, b*].")

class ChartReference(BaseModel):
    """Schema for a full parameter row in the chart."""
    parameter_name: str = Field(..., description="The name of the parameter (e.g., 'pH', 'HARDNESS').")
    row_index: int = Field(..., description="The 0-indexed position of the row on the strip.")
    swatches: List[Swatch] = Field(..., description="List of reference swatches and their LAB values.")


# --- ADD THIS NEW CLASS ---
# This defines the schema for the "Test History" reports we will save.

class MatchResultForDB(BaseModel):
    """Schema for a single result to be saved in the DB."""
    parameter: str
    matched_value: str
    unit: str
    confidence_score: float
    matched_hex: Optional[str] = None

class AnalysisReport(BaseModel):
    """Schema for the final analysis report document in MongoDB."""
    strip_id: str = Field(..., description="Unique ID for this analysis run.")
    timestamp: str = Field(..., description="UTC timestamp of the analysis.")
    location_summary: Optional[str] = Field(None, description="A brief summary of the test location.")
    ai_summary: Optional[str] = Field(None, description="A natural language summary.")
    results: List[MatchResultForDB] = Field(..., description="List of all 16 parameter results.")