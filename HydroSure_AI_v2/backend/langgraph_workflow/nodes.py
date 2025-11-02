# backend/langgraph_workflow/nodes.py
import logging
import json
from typing import Dict, Any, List, Optional
from openai import OpenAI
from backend.core.config import settings
from backend.langgraph_workflow.graph import AnalysisState
from backend.services.llm_service import get_interpretation_summary
from backend.api.schemas import MatchResult
from backend.models.db_models import AnalysisReport, MatchResultForDB
from backend.utils.db import get_db_connection

# --- Imports for Confidence Calculation ---
from backend.utils.image_utils import hex_to_lab
from backend.services.match_service import calculate_delta_e

# Initialize the OpenAI client
try:
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
except Exception as e:
    logging.error(f"Failed to initialize OpenAI client in nodes.py: {e}")
    client = None

# --- Manual Map (Used to build the prompt for the LLM) ---
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

# --- Node 1: The "Super Agent" (AGGRESSIVE PROMPT) ---
def llm_analysis_node(state: AnalysisState) -> Dict[str, Any]:
    """
    Uses GPT-4o to perform segmentation and matching.
    This new prompt forces the LLM to separate its reasoning steps.
    """
    logging.info("Node: Starting full analysis with GPT-4o...")
    
    if not client:
        return {"error_message": "OpenAI client not initialized."}
        
    chart_b64 = state["chart_image_b64"]
    strip_b64 = state["strip_image_b64"]
    
    param_list_str = "\n".join([f"Row {i} (Parameter: {p['name']}): Values are {', '.join(p['values'])}" for i, p in enumerate(MANUAL_PARAMETER_MAP)])
    
    # --- PROMPT UPDATED (V3) ---
    prompt = f"""
    You are a high-accuracy computer vision assistant. You will be given a reference chart (Image 1) and a test strip (Image 2).
    Perform the following tasks IN ORDER for all 16 parameters:
    
    TASK 1: For each pad on the test strip (Image 2) from top to bottom, determine its dominant HEX color.
    TASK 2: For each pad, find the visually closest matching color swatch on the *corresponding row* of the reference chart (Image 1).
    TASK 3: Return the "value" (e.g., "7.5", "100") of that matched chart swatch.
    TASK 4: Return the HEX code of that matched chart swatch from TASK 2.

    The parameters and their corresponding values are:
    {param_list_str}
    
    Return your response ONLY as a JSON object with a single key "results".
    The "results" key must be a list of 16 JSON objects.
    
    Each object must have the following required format. CRITICALLY: `strip_hex` and `chart_hex` MUST be two different values unless they are a perfect match.
    {{
      "parameter": "Parameter Name",
      "matched_value": "The value from the chart you matched (TASK 3)",
      "strip_hex": "The HEX code of the color on the STRIP (TASK 1)",
      "chart_hex": "The HEX code of the *matched swatch* on the CHART (TASK 4)"
    }}
    
    Do not include any other text, explanations, or markdown in your response.
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
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
            max_tokens=3000
        )
        
        response_data = json.loads(response.choices[0].message.content)
        llm_results_list = response_data.get("results", [])

        if not llm_results_list or len(llm_results_list) != 16:
             return {"error_message": f"LLM analysis failed. Expected 16 results, got {len(llm_results_list)}."}

        # Pass the raw list to the next node
        return {"llm_raw_output": llm_results_list, "validation_status": "ALL_VALID"}

    except Exception as e:
        logging.error(f"LLM analysis node failed: {e}")
        return {"error_message": f"LLM analysis failed: {e}"}

# --- Node 2: Calculate Confidence (UPDATED) ---
def calculate_confidence_node(state: AnalysisState) -> Dict[str, Any]:
    """
    Reads the raw LLM output, calculates Delta E, and creates the final MatchResult list.
    """
    logging.info("Node: Calculating Delta E confidence scores...")
    
    llm_raw_output = state.get("llm_raw_output")
    if not llm_raw_output:
        return {"error_message": "No raw LLM output to calculate confidence for."}

    match_results: List[MatchResult] = []

    for res in llm_raw_output:
        try:
            param_name = res.get("parameter")
            strip_hex = res.get("strip_hex")
            chart_hex = res.get("chart_hex")
            
            # --- NEW: Verbose Logging ---
            logging.debug(f"Processing {param_name}: StripHEX={strip_hex}, ChartHEX={chart_hex}")

            if not strip_hex or not chart_hex:
                logging.warning(f"Missing HEX value for {param_name}. Setting score to 999.")
                delta_e_score = 999.0
            
            # --- NEW: Check for LLM "cheating" ---
            elif strip_hex == chart_hex:
                logging.warning(f"LLM returned identical HEX codes for {param_name}. Setting score to 998 (LLM error).")
                delta_e_score = 998.0 # Use a special code for this error
                
            else:
                # 1. Convert HEX codes to LAB
                strip_lab = hex_to_lab(strip_hex)
                chart_lab = hex_to_lab(chart_hex)
                
                # 2. Calculate Delta E
                delta_e_score = calculate_delta_e(strip_lab, chart_lab)
                logging.info(f"Successfully calculated Delta E for {param_name}: {delta_e_score:.2f}")
            
            unit = "ppb" if param_name in ["LEAD", "MANGANESE", "MERCURY"] else "ppm"

            # 3. Create the final MatchResult object
            match_results.append(
                MatchResult(
                    parameter=param_name,
                    matched_value=res.get("matched_value"),
                    unit=unit,
                    confidence_score=delta_e_score,
                    matched_hex=strip_hex # This is the color of the strip pad
                )
            )
            
        except Exception as e:
            logging.error(f"Failed to calculate Delta E for {param_name}: {e}")
            match_results.append(
                MatchResult(
                    parameter=param_name or "Unknown",
                    matched_value="Error",
                    unit="ppm",
                    confidence_score=999.0,
                    matched_hex="#000000"
                )
            )
    
    return {"match_results": match_results}
# --- Node 3: LLM Interpretation (Final) ---
def interpret_results_node(state: AnalysisState) -> Dict[str, Any]:
    """
    Uses LLM to generate a human-readable summary, now including location context.
    """
    logging.info("Node: Starting LLM Interpretation.")
    
    match_results = state.get("match_results")
    if not match_results:
        return {"error_message": "No match results present for interpretation."}
        
    results_dicts = [r.model_dump() for r in match_results]
    
    latitude = state.get("latitude")
    longitude = state.get("longitude")
    location_context = ""
    location_summary = None
    
    if latitude and longitude:
        location_context = f"The test was conducted at geographic coordinates ({latitude:.4f}, {longitude:.4f})."
        location_summary = f"Test location: ({latitude:.4f}, {longitude:.4f})"

    try:
        summary = get_interpretation_summary(results_dicts, location_context)
        return {"ai_summary": summary, "location_summary": location_summary}
        
    except Exception as e:
        logging.error(f"LLM interpretation failed: {e}")
        return {"ai_summary": "Summary generation failed.", "location_summary": location_summary}

# --- Node 4: Save Report to MongoDB (Final) ---
def save_report_node(state: AnalysisState) -> Dict[str, Any]:
    """
    Saves the final, successful analysis report to the MongoDB 'analysis_reports' collection.
    """
    logging.info("Node: Saving report to MongoDB...")
    
    try:
        db = get_db_connection()
        if db is None:
            logging.error("Save Report Node: Could not connect to MongoDB. Skipping save.")
            return {}

        collection = db["analysis_reports"]
        
        results_for_db = [
            MatchResultForDB(**r.model_dump()) for r in state["match_results"]
        ]
        
        report = AnalysisReport(
            strip_id=state["strip_id"],
            timestamp=state["timestamp"],
            location_summary=state.get("location_summary"),
            ai_summary=state.get("ai_summary"),
            results=results_for_db
        )
        
        collection.insert_one(report.model_dump())
        logging.info(f"Successfully saved report {state['strip_id']} to MongoDB.")
        
    except Exception as e:
        logging.error(f"Save Report Node: Failed to save report to MongoDB: {e}")
    
    return {}