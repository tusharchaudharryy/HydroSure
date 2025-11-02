# backend/langgraph_workflow/graph.py
import operator
from typing import TypedDict, List, Dict, Any, Optional
from langgraph.graph import StateGraph, END
from backend.api.schemas import MatchResult

# --- Define the State (UPDATED) ---
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
    
    # --- NEW: Raw LLM output for the confidence node ---
    llm_raw_output: Optional[List[Dict[str, Any]]] 

    # Final Output
    match_results: Optional[List[MatchResult]] # This will be created by the confidence node
    ai_summary: Optional[str]
    location_summary: Optional[str]
    error_message: Optional[str]


# --- Conditional Edges (Unchanged) ---
def decide_next_step(state: AnalysisState) -> str:
    if state.get("error_message"):
        return END
    if state.get("validation_status") == "ALL_VALID":
        return "calculate_confidence"
    else:
        return END

# --- Build the Graph (Unchanged from last step) ---
def build_analysis_graph():
    """Defines and compiles the LangGraph workflow, now with a confidence step."""
    
    from .nodes import (
        llm_analysis_node,
        calculate_confidence_node,
        interpret_results_node,
        save_report_node
    )
    
    workflow = StateGraph(AnalysisState)

    workflow.add_node("llm_analysis", llm_analysis_node)
    workflow.add_node("calculate_confidence", calculate_confidence_node)
    workflow.add_node("interpret_results", interpret_results_node)
    workflow.add_node("save_report", save_report_node)
    
    workflow.set_entry_point("llm_analysis")
    
    workflow.add_conditional_edges(
        "llm_analysis",
        decide_next_step,
        {
            "calculate_confidence": "calculate_confidence", 
            END: END
        }
    )
    
    workflow.add_edge("calculate_confidence", "interpret_results")
    workflow.add_edge("interpret_results", "save_report")
    workflow.add_edge("save_report", END)
    
    return workflow.compile()

analysis_graph = build_analysis_graph()