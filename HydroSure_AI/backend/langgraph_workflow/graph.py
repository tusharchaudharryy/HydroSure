# backend/langgraph_workflow/graph.py
import operator
from typing import TypedDict, List, Dict, Any, Optional
from langgraph.graph import StateGraph, END
# Note: ChartReference model is replaced by Dict[str, Any] since we load raw data

# We still need the schema for the final output
from backend.api.schemas import MatchResult

# --- Define the State (UPDATED) ---
class AnalysisState(TypedDict):
    """
    The state passed between the LangGraph nodes.
    """
    # Input
    strip_image_b64: str
    chart_image_b64: str # NEW
    
    # Dynamic Data (Processed Chart)
    chart_reference: Optional[List[Dict[str, Any]]] # NEW: Processed L*a*b* data from input chart
    
    # CV Output (Initial Pads)
    segmented_pads: Optional[List[Dict[str, Any]]] # List of {index, image_b64, lab_color, bgr_color, is_valid}
    
    # LLM Validation Output
    validation_status: str # "ALL_VALID", "INVALID_FOUND", "ERROR"
    
    # Final Output
    match_results: Optional[List[MatchResult]]
    ai_summary: Optional[str]
    error_message: Optional[str]


# --- Conditional Edges ---

def decide_next_step(state: AnalysisState) -> str:
    """Decides whether to proceed to matching or stop due to invalid input."""
    if state.get("error_message"):
        return "validation_fail"
    if state.get("validation_status") == "ALL_VALID":
        return "match_colors"
    elif state.get("validation_status") == "INVALID_FOUND":
        return "validation_fail"
    else:
        return "validation_fail"


# --- Build the Graph ---

def build_analysis_graph():
    """Defines and compiles the LangGraph workflow."""
    
    # Import nodes here to break circular dependency
    from .nodes import (
        chart_processor_node, # Replaces load_data_node
        segment_strip_node, 
        validate_segments_node, 
        match_colors_node, 
        interpret_results_node
    )
    
    workflow = StateGraph(AnalysisState)

    # 1. Start: Process the Chart (New Entry)
    workflow.add_node("chart_processor", chart_processor_node)
    
    # 2. CV: Segment the strip
    workflow.add_node("segment_strip", segment_strip_node)
    
    # 3. LLM-V: Validate the segments
    workflow.add_node("validate_segments", validate_segments_node)
    
    # 4. CV/Match: Perform color comparison
    workflow.add_node("match_colors", match_colors_node)
    
    # 5. LLM-T: Interpret the results
    workflow.add_node("interpret_results", interpret_results_node)
    
    # --- Define Edges ---
    
    # Entry Point: Always start by processing the chart image
    workflow.set_entry_point("chart_processor")
    
    # Flow after Chart Processor:
    workflow.add_edge("chart_processor", "segment_strip")
    
    # Flow after Segmentation:
    workflow.add_edge("segment_strip", "validate_segments")
    
    # Conditional edge based on LLM Validation:
    workflow.add_conditional_edges(
        "validate_segments",
        decide_next_step,
        {
            "match_colors": "match_colors",     # Go to matching
            "validation_fail": END              # Abort (returns current state with error_message)
        }
    )
    
    # Flow after Matching:
    workflow.add_edge("match_colors", "interpret_results")
    
    # Final Output:
    workflow.add_edge("interpret_results", END)
    
    return workflow.compile()

# Global graph instance (to be used by FastAPI)
analysis_graph = build_analysis_graph()