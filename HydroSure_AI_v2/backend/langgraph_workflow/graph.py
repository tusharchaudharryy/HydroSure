# backend/langgraph_workflow/graph.py
import operator
from typing import TypedDict, List, Dict, Any, Optional
from langgraph.graph import StateGraph, END
from backend.api.schemas import MatchResult # Keep this for node output

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
    
    # --- NEW: ID and Timestamp ---
    strip_id: str
    timestamp: str
    
    # Internal State
    validation_status: str 
    
    # Final Output
    match_results: Optional[List[MatchResult]]
    ai_summary: Optional[str]
    location_summary: Optional[str]
    error_message: Optional[str]


# --- Conditional Edges ---
def decide_next_step(state: AnalysisState) -> str:
    """Decides whether to proceed to summary or stop."""
    if state.get("error_message"):
        return END # Stop if LLM analysis failed
    if state.get("validation_status") == "ALL_VALID":
        return "interpret_results" # Proceed to summary
    else:
        return END # Fallback

# --- Build the Graph (UPDATED) ---
def build_analysis_graph():
    """Defines and compiles the LangGraph workflow, now with a save step."""
    
    # Import nodes here to break circular dependency
    from .nodes import (
        llm_analysis_node,
        interpret_results_node,
        save_report_node  # <-- NEW NODE
    )
    
    workflow = StateGraph(AnalysisState)

    # 1. Start: Full LLM Analysis
    workflow.add_node("llm_analysis", llm_analysis_node)
    
    # 2. LLM-T: Interpret the results
    workflow.add_node("interpret_results", interpret_results_node)
    
    # 3. Save: Save report to MongoDB
    workflow.add_node("save_report", save_report_node) # <-- NEW NODE
    
    # --- Define Edges ---
    
    # Entry Point:
    workflow.set_entry_point("llm_analysis")
    
    # Conditional edge based on LLM analysis success
    workflow.add_conditional_edges(
        "llm_analysis",
        decide_next_step,
        {
            "interpret_results": "interpret_results",
            END: END
        }
    )
    
    # Flow after interpretation
    workflow.add_edge("interpret_results", "save_report") # <-- UPDATED EDGE
    
    # Final Output:
    workflow.add_edge("save_report", END) # <-- NEW FINAL EDGE
    
    return workflow.compile()

# Global graph instance (to be used by FastAPI)
analysis_graph = build_analysis_graph()