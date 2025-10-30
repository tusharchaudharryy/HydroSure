# backend/langgraph_workflow/graph.py
import operator
from typing import TypedDict, List, Dict, Any, Optional
from langgraph.graph import StateGraph, END
from backend.api.schemas import MatchResult

# --- Define the State (REVISED) ---
class AnalysisState(TypedDict):
    """
    The state passed between the LangGraph nodes.
    """
    # Input
    strip_image_b64: str
    chart_image_b64: str 
    
    # We no longer need chart_reference in the state
    
    # We no longer need segmented_pads in the state
    
    # We use validation_status as a simple "success" flag from the LLM
    validation_status: str 
    
    # Final Output
    match_results: Optional[List[MatchResult]]
    ai_summary: Optional[str]
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

# --- Build the Graph (REVISED) ---
def build_analysis_graph():
    """Defines and compiles the new, simpler LangGraph workflow."""
    
    # Import nodes here to break circular dependency
    from .nodes import (
        llm_analysis_node,
        interpret_results_node
    )
    
    workflow = StateGraph(AnalysisState)

    # 1. Start: Full LLM Analysis
    workflow.add_node("llm_analysis", llm_analysis_node)
    
    # 2. LLM-T: Interpret the results
    workflow.add_node("interpret_results", interpret_results_node)
    
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
    
    # Final Output:
    workflow.add_edge("interpret_results", END)
    
    return workflow.compile()

# Global graph instance (to be used by FastAPI)
analysis_graph = build_analysis_graph()