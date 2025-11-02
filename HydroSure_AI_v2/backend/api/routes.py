# backend/api/routes.py
from fastapi import APIRouter, HTTPException, status, UploadFile, File, Form
from datetime import datetime, timezone # <-- ADD timezone
from uuid import uuid4
import logging
import base64
from typing import Optional
from backend.api.schemas import AnalysisResponse, MatchResult
from backend.langgraph_workflow.graph import analysis_graph, AnalysisState

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResponse, status_code=status.HTTP_200_OK)
async def analyze_strip_files(
    strip_file: UploadFile = File(..., description="Photo of the water-dipped test strip."),
    chart_file: UploadFile = File(..., description="Photo of the reference color chart for calibration."),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None)
):
    """
    Accepts two image files (strip and chart) and optional location data,
    then initiates the LangGraph analysis workflow.
    """
    logging.info("Received new file analysis request. Starting LangGraph workflow.")
    
    # --- GENERATE ID AND TIMESTAMP HERE ---
    start_time = datetime.now(timezone.utc)
    run_id = str(uuid4())

    # --- 1. Read Files and Convert to Base64 ---
    try:
        strip_contents = await strip_file.read()
        chart_contents = await chart_file.read()
        
        strip_b64 = base64.b64encode(strip_contents).decode('utf-8')
        chart_b64 = base64.b64encode(chart_contents).decode('utf-8')
        
    except Exception as e:
        logging.error("File processing error: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not read or convert image files: {e}"
        )
    
    # --- 2. Prepare Initial State (UPDATED) ---
    initial_state = AnalysisState(
        strip_id=run_id, # <-- Pass to state
        timestamp=start_time.isoformat(), # <-- Pass to state
        strip_image_b64=strip_b64,
        chart_image_b64=chart_b64,
        latitude=latitude,
        longitude=longitude,
        validation_status="",
        match_results=None,
        ai_summary=None,
        location_summary=None,
        error_message=None
    )
    
    # --- 3. Execute LangGraph Workflow ---
    try:
        final_state = analysis_graph.invoke(initial_state)

        # --- 4. Error Checks ---
        if final_state.get("error_message"):
            logging.error("Workflow failed: %s", final_state["error_message"])
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=final_state["error_message"]
            )
        
        # --- 5. Assemble Final Response ---
        final_results = final_state.get("match_results", [])
        
        response = AnalysisResponse(
            strip_id=run_id,
            timestamp=start_time.isoformat(), # Use the same timestamp
            location_summary=final_state.get("location_summary"),
            ai_summary=final_state.get("ai_summary", "Summary not available."),
            results=final_results
        )
        
        return response

    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"LangGraph execution failed unexpectedly: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal analysis error: {e}"
        )