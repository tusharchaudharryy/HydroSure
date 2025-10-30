# backend/langgraph_workflow/nodes.py
import logging
import json
from typing import Dict, Any, List
from openai import OpenAI
from backend.core.config import settings
from backend.langgraph_workflow.graph import AnalysisState
from backend.services.llm_service import get_interpretation_summary
from backend.api.schemas import MatchResult

# Initialize the OpenAI client
try:
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
except Exception as e:
    logging.error(f"Failed to initialize OpenAI client in nodes.py: {e}")
    client = None

# --- Manual Map (Still needed for the prompt) ---
MANUAL_PARAMETER_MAP = [
    {"name": "pH", "values": ["6.0", "6.5", "7.0", "7.5", "8.0", "8.5", "9.0"]},
    {"name": "HARDNESS", "values": ["0", "25", "50", "100", "250", "425"]},
    {"name": "HYDROGEN SULFIDE", "values": ["0", "0.5", "1", "2", "5", "10"]},
    {"name": "IRON", "values": ["0", "0.3", "0.5", "1.0", "3.0", "5.0", "20"]},
    {"name": "COPPER", "values": ["0", "0.1", "0.2", "0.4", "1", "2", "5"]},
    {"name": "LEAD", "values": ["0", "5", "15", "30", "50"]},
    {"name": "MANGANESE", "values": ["0", "0.05", "0.1", "0.5", "1.0", "2.0", "5.0"]},
    {"name": "TOTAL CHLORINE", "values": ["0", "0.5", "1", "3", "5", "10", "20"]},
    {"name": "MERCURY", "values": ["0", "0.002", "0.005", "0.01", "0.02", "0.04", "0.08"]},
    {"name": "NITRATE", "values": ["0", "10", "25", "50", "100", "250", "500"]},
    {"name": "NITRITE", "values": ["0", "1", "5", "10", "20", "40", "80"]},
    {"name": "SULFATE", "values": ["0", "200", "400", "800", "1200", "1600"]},
    {"name": "ZINC", "values": ["0", "5", "10", "30", "50", "100"]},
    {"name": "FLUORIDE", "values": ["0", "10", "25", "50", "100", "1000"]},
    {"name": "SODIUM CHLORIDE", "values": ["0", "100", "250", "500", "1000", "2000"]},
    {"name": "TOTAL ALKALINITY", "values": ["0", "40", "80", "120", "180", "240"]}
]

# --- Node 1: The "Super Agent" (Replaces 4 old nodes) ---
def llm_analysis_node(state: AnalysisState) -> Dict[str, Any]:
    """
    Uses GPT-4o to perform the entire analysis in one step:
    1. Calibrate to the chart image.
    2. Segment the 16 pads from the strip image.
    3. Get the color of each pad.
    4. Match it to the calibrated chart.
    5. Return the results.
    """
    logging.info("Node: Starting full analysis with GPT-4o...")
    
    if not client:
        return {"error_message": "OpenAI client not initialized."}
        
    chart_b64 = state["chart_image_b64"]
    strip_b64 = state["strip_image_b64"]
    
    # Create the text for the prompt
    param_list_str = "\n".join([f"Row {i} (Parameter: {p['name']}): Values are {', '.join(p['values'])}" for i, p in enumerate(MANUAL_PARAMETER_MAP)])
    
    prompt = f"""
    You are a highly accurate computer vision assistant for water quality testing.
    You will be given two images:
    1. A reference color chart (Image 1).
    2. A dipped test strip (Image 2).
    
    The test strip has 16 pads, corresponding top-to-bottom to the 16 rows on the chart.
    The parameters and their corresponding values are:
    {param_list_str}
    
    Your task is to:
    1. For each of the 16 pads on the test strip (Image 2), from top to bottom, accurately determine its dominant RGB color.
    2. For each pad, compare its color to the corresponding row of swatches on the reference chart (Image 1).
    3. Find the closest matching value from the chart for that pad.
    
    Return your response ONLY as a JSON object with a single key "results".
    The "results" key should contain a list of 16 JSON objects, one for each parameter, in order.
    
    Each object must have the following format:
    {{
      "parameter": "Parameter Name",
      "matched_value": "The value from the chart you matched (e.g., '6.0', '100')",
      "matched_hex": "The HEX code of the color you detected on the STRIP (e.g., '#545554')"
    }}
    
    Example for the first pad (pH):
    {{
      "parameter": "pH",
      "matched_value": "7.5",
      "matched_hex": "#D8C474"
    }}
    
    Do not include any other text, explanations, or markdown in your response.
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o", # Use the most advanced vision model
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{chart_b64}", "detail": "high"}},
                        {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{strip_b64}", "detail": "high"}},
                    ]
                }
            ],
            response_format={"type": "json_object"},
            temperature=0.0,
            max_tokens=3000 # Increase token limit for 16 results
        )
        
        response_data = json.loads(response.choices[0].message.content)
        
        # --- Convert LLM output to our MatchResult schema ---
        match_results = []
        for res in response_data.get("results", []):
            param_name = res.get("parameter")
            unit = "ppb" if param_name in ["LEAD", "MANGANESE", "MERCURY"] else "ppm"
            
            match_results.append(
                MatchResult(
                    parameter=param_name,
                    matched_value=res.get("matched_value"),
                    unit=unit,
                    confidence_score=0.0, # We no longer have Delta E; 0.0 means "LLM Confident"
                    matched_hex=res.get("matched_hex")
                )
            )
            
        if len(match_results) != 16:
            return {"error_message": f"LLM analysis failed. Expected 16 results, got {len(match_results)}."}

        # We set validation_status to ALL_VALID to pass the conditional gate
        return {"match_results": match_results, "validation_status": "ALL_VALID"}

    except Exception as e:
        logging.error(f"LLM analysis node failed: {e}")
        return {"error_message": f"LLM analysis failed: {e}"}

# --- Node 2: LLM Interpretation ---
def interpret_results_node(state: AnalysisState) -> Dict[str, Any]:
    """
    Uses LLM to generate a human-readable summary from the match results.
    """
    logging.info("Node: Starting LLM Interpretation.")
    
    match_results = state.get("match_results")
    if not match_results:
        return {"error_message": "No match results present for interpretation."}
        
    # Convert Pydantic models to dicts for the LLM prompt
    results_dicts = [r.model_dump() for r in match_results]
    
    try:
        summary = get_interpretation_summary(results_dicts)
    except Exception as e:
        logging.error(f"LLM interpretation failed: {e}")
        return {"error_message": f"LLM interpretation failed: {e}"}
        
    return {"ai_summary": summary}