# backend/langgraph_workflow/graph.py
import operator
from typing import TypedDict, List, Dict, Any, Optional
from langgraph.graph import StateGraph, END
from backend.api.schemas import MatchResult

# --- Define the State (Final) ---
class AnalysisState(TypedDict):
    """
    The state passed between the LangGraph nodes.
    """
    # Input
    strip_image_b64: str
    chart_image_b64: str 
    latitude: Optional[float]
    longitude: Optional[float]
    strip_id: str
    timestamp: str
    
    # Internal State
    validation_status: str 
    
    # NEW: Raw LLM output for the confidence node
    llm_raw_output: Optional[List[Dict[str, Any]]] 

    # Final Output
    match_results: Optional[List[MatchResult]] # This will be created by the confidence node
    ai_summary: Optional[str]
    location_summary: Optional[str]
    error_message: Optional[str]


# --- Conditional Edges ---
def decide_next_step(state: AnalysisState) -> str:
    """Decides whether to proceed to summary or stop."""
    if state.get("error_message"):
        return END # Stop if LLM analysis failed
    if state.get("validation_status") == "ALL_VALID":
        return "calculate_confidence" # Proceed to confidence calculation
    else:
        return END # Fallback

# --- Build the Graph (Final) ---
def build_analysis_graph():
    """Defines and compiles the LangGraph workflow with confidence scoring."""
    
    # Import nodes here to break circular dependency
    from .nodes import (
        llm_analysis_node,
        calculate_confidence_node,
        interpret_results_node,
        save_report_node
    )
    
    workflow = StateGraph(AnalysisState)

    # 1. Start: Full LLM Analysis
    workflow.add_node("llm_analysis", llm_analysis_node)
    
    # 2. NEW: Calculate Confidence
    workflow.add_node("calculate_confidence", calculate_confidence_node)
    
    # 3. LLM-T: Interpret the results
    workflow.add_node("interpret_results", interpret_results_node)
    
    # 4. Save: Save report to MongoDB
    workflow.add_node("save_report", save_report_node)
    
    # --- Define Edges ---
    
    # Entry Point:
    workflow.set_entry_point("llm_analysis")
    
    # Conditional edge based on LLM analysis success
    workflow.add_conditional_edges(
        "llm_analysis",
        decide_next_step,
        {
            "calculate_confidence": "calculate_confidence", 
            END: END
        }
    )
    
    # New linear flow
    workflow.add_edge("calculate_confidence", "interpret_results")
    workflow.add_edge("interpret_results", "save_report")
    workflow.add_edge("save_report", END)
    
    return workflow.compile()

# Global graph instance (to be used by FastAPI)
analysis_graph = build_analysis_graph()