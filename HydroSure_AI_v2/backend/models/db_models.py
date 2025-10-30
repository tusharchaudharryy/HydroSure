# backend/models/db_models.py
from pydantic import BaseModel, Field
from typing import List

class Swatch(BaseModel):
    """Schema for a single color swatch on the chart."""
    value: str = Field(..., description="The concentration value (e.g., '10', '425').")
    lab_color: List[float] = Field(..., description="The CIELAB color vector [L*, a*, b*].")

class ChartReference(BaseModel):
    """Schema for a full parameter row in the chart."""
    parameter_name: str = Field(..., description="The name of the parameter (e.g., 'pH', 'HARDNESS').")
    row_index: int = Field(..., description="The 0-indexed position of the row on the strip.")
    swatches: List[Swatch] = Field(..., description="List of reference swatches and their LAB values.")