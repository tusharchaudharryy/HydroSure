import json
from typing import TypedDict, List, Annotated
from langchain_core.messages import BaseMessage
from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.prebuilt import ToolExecutor

from tools import analyze_reference_chart, analyze_test_strip, interpret_results
from prompts import RESULT_FORMATTING_PROMPT

# --- Agent State ---
class AgentState(TypedDict):
    chart_image_path: str
    strip_image_path: str
    chart_colors: dict
    strip_colors: dict
    results: dict
    final_summary: str

# --- Agent Nodes ---
def analyze_chart_node(state: AgentState):
    """Node to analyze the reference chart image."""
    print("---ANALYZING REFERENCE CHART---")
    chart_image_path = state["chart_image_path"]
    chart_colors = analyze_reference_chart.invoke({"image_path": chart_image_path})
    return {"chart_colors": chart_colors}

def analyze_strip_node(state: AgentState):
    """Node to analyze the test strip image."""
    print("---ANALYZING TEST STRIP---")
    strip_image_path = state["strip_image_path"]
    strip_colors = analyze_test_strip.invoke({"image_path": strip_image_path})
    return {"strip_colors": strip_colors}

def interpret_results_node(state: AgentState):
    """Node to compare colors and interpret the results."""
    print("---INTERPRETING RESULTS---")
    strip_colors = state["strip_colors"]
    chart_colors = state["chart_colors"]
    results = interpret_results.invoke({
        "strip_colors": strip_colors,
        "chart_colors": chart_colors
    })
    return {"results": results}

def summarize_results_node(state: AgentState):
    """Node to generate a final, human-readable summary using an LLM."""
    print("---GENERATING SUMMARY---")
    # NOTE: Using Google Gemini Pro
    # Make sure you have GOOGLE_API_KEY set in your environment variables
    model = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0)
    
    results_json = json.dumps(state["results"], indent=2)
    
    prompt = RESULT_FORMATTING_PROMPT.format_messages(results_json=results_json)
    
    response = model.invoke(prompt)
    summary = response.content
    
    return {"final_summary": summary}


# --- Graph Definition ---
def build_graph():
    """Builds and compiles the LangGraph agent."""
    workflow = StateGraph(AgentState)

    # Add nodes
    workflow.add_node("analyze_chart", analyze_chart_node)
    workflow.add_node("analyze_strip", analyze_strip_node)
    workflow.add_node("interpret_results", interpret_results_node)
    workflow.add_node("summarize_results", summarize_results_node)

    # Define edges
    workflow.set_entry_point("analyze_chart")
    workflow.add_edge("analyze_chart", "analyze_strip")
    workflow.add_edge("analyze_strip", "interpret_results")
    workflow.add_edge("interpret_results", "summarize_results")
    workflow.add_edge("summarize_results", END)

    # Compile the graph
    app = workflow.compile()
    return app

