# backend/api/routes.py (MODIFIED)
from fastapi import APIRouter, HTTPException, status, UploadFile, File, Form, Depends
from datetime import datetime
from uuid import uuid4
import logging
import base64 # <-- NEW IMPORT
from backend.api.schemas import AnalysisResponse, MatchResult
from backend.langgraph_workflow.graph import analysis_graph, AnalysisState
# Note: Import of get_hex_from_bgr is not needed here as it's a util.

router = APIRouter()

# The endpoint now accepts two files in multipart/form-data format
@router.post("/analyze", response_model=AnalysisResponse, status_code=status.HTTP_200_OK)
async def analyze_strip_files(
    strip_file: UploadFile = File(..., description="Photo of the water-dipped test strip."),
    chart_file: UploadFile = File(..., description="Photo of the reference color chart for calibration.")
):
    """
    Accepts two image files (strip and chart) and initiates the LangGraph analysis workflow.
    """
    logging.info("Received new file analysis request. Starting LangGraph workflow.")
    
    start_time = datetime.utcnow()
    run_id = str(uuid4())

    # --- 1. Read Files and Convert to Base64 ---
    
    try:
        # Read file contents
        strip_contents = await strip_file.read()
        chart_contents = await chart_file.read()
        
        # Convert binary file contents to Base64 strings (required for internal LLM use)
        strip_b64 = base64.b64encode(strip_contents).decode('utf-8')
        chart_b64 = base64.b64encode(chart_contents).decode('utf-8')
        
    except Exception as e:
        logging.error("File processing error: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not read or convert image files: {e}"
        )
    
    # --- 2. Prepare Initial State ---
    initial_state = AnalysisState(
        strip_image_b64=strip_b64,
        chart_image_b64=chart_b64,
        chart_reference=None,
        segmented_pads=None,
        validation_status="",
        match_results=None,
        ai_summary=None,
        error_message=None
    )
    
    # --- 3. Execute LangGraph Workflow ---
    try:
        final_state = analysis_graph.invoke(initial_state)

        # --- 4. Error and Abort Checks ---
        if final_state.get("error_message"):
            logging.error("Workflow failed: %s", final_state["error_message"])
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=final_state["error_message"]
            )
        
        if final_state.get("validation_status") == "INVALID_FOUND":
            detail_msg = "Analysis aborted: The submitted strip image was blurry, poorly lit, or did not clearly show the 16 test pads."
            logging.warning(detail_msg)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=detail_msg
            )
        
        # --- 5. Assemble Final Response ---
        # Note: The MatchResult object creation relies on fields attached during the LangGraph run.
        
        final_results = final_state.get("match_results", [])
        
        # Manually convert MatchResult Pydantic objects to dicts for the final list
        results_list = [r.model_dump() for r in final_results]

        response = AnalysisResponse(
            strip_id=run_id,
            timestamp=start_time.isoformat() + "Z",
            ai_summary=final_state.get("ai_summary", "Summary not available."),
            results=results_list
        )
        
        return response

    except HTTPException:
        raise
    except Exception as e:
        logging.error("LangGraph execution failed unexpectedly: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal analysis error: {e}"
        )