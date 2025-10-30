# backend/langgraph_workflow/nodes.py
import logging
from typing import Dict, Any, List, Optional, Tuple

import numpy as np
import cv2
from skimage.color import rgb2lab

from backend.langgraph_workflow.graph import AnalysisState
from backend.services.chart_service import load_chart_reference
from backend.services.strip_service import segment_strip_pads
from backend.services.llm_service import validate_pad_images, get_interpretation_summary
from backend.services.match_service import find_closest_match
from backend.utils.image_utils import b64_to_cv_image, get_hex_from_bgr
from backend.api.schemas import MatchResult

# Optional manual fallback parameter map (kept for reference; prefer DB)
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
    {"name": "TOTAL ALKALINITY", "values": ["0", "40", "80", "120", "180", "240"]},
]


# -------------------------
# Helper utilities
# -------------------------
def _extract_swatches_from_chart_image(chart_image_b64: str) -> Tuple[Optional[List[Dict[str, Any]]], Optional[str]]:
    """
    If the user provided a chart image (base64), extract per-row swatch LAB colors.
    Returns (chart_reference_list, error_message)
    chart_reference_list: list of dicts:
      { "parameter_name": <str>, "row_index": <int>, "swatches": [ {"value":..., "lab_color": [...]} ... ] }
    """
    try:
        chart_image = b64_to_cv_image(chart_image_b64)
    except Exception as e:
        logging.exception("Chart image decoding failed.")
        return None, f"Chart image decoding error: {e}"

    h_img, w_img = chart_image.shape[:2]

    # Heuristic: swatches on right portion of the image (configurable)
    start_x_swatches = w_img * 40 // 100
    width_swatches = w_img - start_x_swatches

    NUM_ROWS = len(MANUAL_PARAMETER_MAP)
    pad_height = max(1, h_img // NUM_ROWS)

    chart_reference_list: List[Dict[str, Any]] = []

    for i, param_info in enumerate(MANUAL_PARAMETER_MAP):
        y_start = i * pad_height
        y_end = min(h_img, (i + 1) * pad_height)

        row_crop = chart_image[y_start:y_end, start_x_swatches:start_x_swatches + width_swatches]
        if row_crop.size == 0:
            logging.warning("Empty row crop for row %d", i)
            continue

        h_row, w_row = row_crop.shape[:2]
        num_swatches = len(param_info["values"])
        swatch_width = max(1, w_row // num_swatches)
        swatch_data = []

        for j in range(num_swatches):
            x_start = j * swatch_width
            x_end = min(w_row, (j + 1) * swatch_width)

            # central ROI (20% inset)
            roi_y0 = h_row // 4
            roi_y1 = max(roi_y0 + 1, h_row * 3 // 4)
            roi_x0 = x_start + swatch_width // 4
            roi_x1 = max(roi_x0 + 1, x_end - swatch_width // 4)

            sample_roi = row_crop[roi_y0:roi_y1, roi_x0:roi_x1]

            if sample_roi.size == 0 or sample_roi.shape[0] < 3 or sample_roi.shape[1] < 3:
                logging.warning("Tiny or empty ROI for row %d swatch %d", i, j)
                continue

            avg_bgr = np.mean(sample_roi.reshape(-1, 3), axis=0).astype(np.uint8)
            avg_bgr_arr = np.array([[avg_bgr]], dtype=np.uint8)  # shape (1,1,3)
            avg_rgb_pixel = cv2.cvtColor(avg_bgr_arr, cv2.COLOR_BGR2RGB)
            lab_color = rgb2lab(avg_rgb_pixel)[0][0].tolist()

            swatch_data.append({"value": param_info["values"][j], "lab_color": lab_color})

        chart_reference_list.append(
            {"parameter_name": param_info["name"], "row_index": i, "swatches": swatch_data}
        )

    if len(chart_reference_list) < len(MANUAL_PARAMETER_MAP):
        return None, "Chart processing failed to extract all parameter rows from provided chart image."

    return chart_reference_list, None


def _get_ref_swatches_and_name(ref_item: Any) -> Tuple[List[Dict[str, Any]], str]:
    """
    Accepts either a plain dict or an object (e.g., Pydantic), and returns (swatches_list, parameter_name).
    Swatches_list must be a list of items with keys 'value' and either attribute 'lab_color' or key 'lab_color'.
    """
    # If dict-like
    if isinstance(ref_item, dict):
        param_name = ref_item.get("parameter_name") or ref_item.get("name") or ref_item.get("parameter", "UNKNOWN")
        swatches = ref_item.get("swatches") or ref_item.get("values") or []
        # If swatches are just raw values (string list), convert to dicts with no lab_color
        if swatches and isinstance(swatches[0], (str, int, float)):
            swatches = [{"value": str(v)} for v in swatches]
        return swatches, param_name

    # object-like (Pydantic / attr)
    param_name = getattr(ref_item, "parameter_name", None) or getattr(ref_item, "name", None) or getattr(ref_item, "parameter", "UNKNOWN")
    swatches = getattr(ref_item, "swatches", None) or getattr(ref_item, "values", None) or []
    # If swatches are raw values convert:
    if swatches and not isinstance(swatches[0], dict):
        swatches = [{"value": str(v)} for v in swatches]
    return swatches, param_name


# -------------------------
# Node 1: Optional realtime chart processing (from provided image)
# -------------------------
def chart_processor_node(state: AnalysisState) -> Dict[str, Any]:
    """
    If the pipeline includes a chart image in the state under 'chart_image_b64',
    extract LAB swatches per row for use in matching (real-time calibration).
    Returns {'chart_reference': [...]} or {'error_message': ...}
    """
    logging.info("Node: Starting Real-Time Chart Processing (if provided).")

    if "chart_image_b64" not in state or not state.get("chart_image_b64"):
        logging.info("No realtime chart image provided in state; skipping realtime chart processing.")
        return {"chart_reference": None}

    chart_ref_list, error = _extract_swatches_from_chart_image(state["chart_image_b64"])
    if error:
        logging.error("Chart processing failed: %s", error)
        return {"error_message": error}

    logging.info("Chart processing completed. Extracted %d rows.", len(chart_ref_list))
    return {"chart_reference": chart_ref_list}


# -------------------------
# Node 1b: Load static chart reference from DB
# -------------------------
def load_data_node(state: AnalysisState) -> Dict[str, Any]:
    """Loads static chart reference data from MongoDB (fallback / primary)."""
    logging.info("Node: Starting Data Load from DB.")
    try:
        chart_ref = load_chart_reference()
    except Exception as e:
        logging.exception("Failed to load chart reference from DB.")
        return {"error_message": f"Failed to load chart reference data from MongoDB: {e}"}

    if not chart_ref:
        logging.error("Chart reference returned empty from DB.")
        return {"error_message": "Failed to load chart reference data from MongoDB."}

    return {"chart_reference": chart_ref}


# -------------------------
# Node 2: Computer Vision Segmentation
# -------------------------
def segment_strip_node(state: AnalysisState) -> Dict[str, Any]:
    """
    Converts the provided strip image (base64) into segmented pads.
    Expects state['strip_image_b64'] to exist.
    Returns {'segmented_pads': [...] } or {'error_message': ...}
    Each pad item expected fields: 'index', 'lab_color', 'bgr_color', ...
    """
    logging.info("Node: Starting Strip Segmentation (CV).")

    if "strip_image_b64" not in state:
        return {"error_message": "No strip image provided in state."}

    try:
        strip_image = b64_to_cv_image(state["strip_image_b64"])
    except Exception as e:
        logging.exception("Image decoding failed.")
        return {"error_message": f"Image decoding error: {e}"}

    try:
        segmented_pads = segment_strip_pads(strip_image)
    except Exception as e:
        logging.exception("Segmentation failed.")
        return {"error_message": f"Strip segmentation failed: {e}"}

    if not segmented_pads:
        return {"error_message": "Segmentation failed: Could not detect any pads on the strip."}

    logging.info("Segmentation successful: %d pads detected.", len(segmented_pads))
    return {"segmented_pads": segmented_pads}


# -------------------------
# Node 3: LLM Visual Validation
# -------------------------
def validate_segments_node(state: AnalysisState) -> Dict[str, Any]:
    """
    Uses an LLM/vision service to validate each pad image.
    The LLM service should return the segmented_pads list with an 'is_valid' boolean on each pad.
    """
    logging.info("Node: Starting LLM Visual Validation.")

    if "segmented_pads" not in state:
        return {"error_message": "No segmented pads found in state for validation."}

    segmented_pads = state["segmented_pads"]

    try:
        validated_pads = validate_pad_images(segmented_pads)
    except Exception as e:
        logging.exception("LLM validation failed.")
        return {"error_message": f"Validation service error: {e}"}

    invalid_pads_count = sum(1 for pad in validated_pads if pad.get("is_valid") is False)
    if invalid_pads_count > 0:
        logging.warning("Validation found %d invalid pads.", invalid_pads_count)
        return {"segmented_pads": validated_pads, "validation_status": "INVALID_FOUND"}

    logging.info("Validation successful: All segmented pads are valid.")
    return {"segmented_pads": validated_pads, "validation_status": "ALL_VALID"}


# -------------------------
# Node 4: Color Matching (Delta E) and Results
# -------------------------
def match_colors_node(state: AnalysisState) -> Dict[str, Any]:
    """
    Matches each segmented pad LAB color to the closest swatch in the chart reference.
    Chart reference may be provided from realtime chart_processor_node (list of dicts)
    or loaded from DB (could be list of objects or dicts).
    Returns {'match_results': [MatchResult, ...]} or {'error_message': ...}
    """
    logging.info("Node: Starting Color Matching (Delta E).")

    chart_reference = state.get("chart_reference")
    segmented_pads = state.get("segmented_pads")

    if not segmented_pads:
        return {"error_message": "No segmented pads available for matching."}

    if not chart_reference:
        # Try to load from DB as fallback
        try:
            chart_reference = load_chart_reference()
            if not chart_reference:
                return {"error_message": "No chart reference available for matching."}
            logging.info("Loaded chart reference from DB as fallback for matching.")
        except Exception as e:
            logging.exception("Failed to load chart reference fallback.")
            return {"error_message": f"Failed to obtain chart reference: {e}"}

    match_results: List[MatchResult] = []

    for pad in segmented_pads:
        try:
            pad_index = pad.get("index")
            pad_lab = pad.get("lab_color")
            pad_bgr = pad.get("bgr_color")
            if pad_lab is None or pad_bgr is None or pad_index is None:
                logging.warning("Pad missing required fields (index/lab_color/bgr_color). Skipping pad.")
                continue

            # Get the corresponding reference row
            try:
                ref_item = chart_reference[pad_index]
            except Exception:
                logging.error("Match Node: Index mismatch for pad index %s. Attempting to find by row_index.", pad_index)
                # try to find by row_index key in chart_reference
                found = None
                for r in chart_reference:
                    r_index = None
                    if isinstance(r, dict):
                        r_index = r.get("row_index")
                    else:
                        r_index = getattr(r, "row_index", None)
                    if r_index == pad_index:
                        found = r
                        break
                if not found:
                    logging.error("Could not locate chart reference row for pad index %s. Skipping.", pad_index)
                    continue
                ref_item = found

            swatches, param_name = _get_ref_swatches_and_name(ref_item)

            # If swatches don't include lab_color values (e.g., loaded DB contains RGB/BGR),
            # the find_closest_match implementation should handle conversions. We assume it expects
            # pad_lab and chart swatches where each swatch is dict with 'lab_color' and 'value'.
            match_output = find_closest_match(pad_lab, swatches)

            # Heuristic for unit determination (configurable)
            uparam = str(param_name).upper() if param_name else ""
            unit = "ppb" if uparam in ["LEAD", "MANGANESE", "MERCURY"] else "ppm"

            match_results.append(
                MatchResult(
                    parameter=param_name,
                    matched_value=match_output.get("matched_value"),
                    unit=unit,
                    confidence_score=match_output.get("confidence_score"),
                    matched_hex=get_hex_from_bgr(pad_bgr)
                )
            )
        except Exception as e:
            logging.exception("Matching failed for pad: %s", e)
            continue

    if not match_results:
        return {"error_message": "Color matching produced no results."}

    # attach row_index to results if consumer expects it (non-persistent)
    for idx, res in enumerate(match_results):
        try:
            # If Pydantic model supports attribute setting, attach
            setattr(res, "row_index", idx)
        except Exception:
            # otherwise ignore - result objects should be serializable via .model_dump()
            pass

    logging.info("Color matching completed with %d results.", len(match_results))
    return {"match_results": match_results}


# -------------------------
# Node 5: LLM Interpretation / Summary
# -------------------------
def interpret_results_node(state: AnalysisState) -> Dict[str, Any]:
    """
    Uses LLM to generate a human-readable summary from the match results.
    Expects state['match_results'] to be a list of MatchResult models or dicts.
    Returns {'ai_summary': <str>}
    """
    logging.info("Node: Starting LLM Interpretation.")

    match_results = state.get("match_results")
    if not match_results:
        return {"error_message": "No match results present for interpretation."}

    # Convert Pydantic models to dicts if needed
    results_for_llm = []
    for r in match_results:
        try:
            # Pydantic v2 model_dump support
            result_dict = r.model_dump() if hasattr(r, "model_dump") else (r.dict() if hasattr(r, "dict") else dict(r))
        except Exception:
            # fallback
            result_dict = r if isinstance(r, dict) else {}
        results_for_llm.append(result_dict)

    try:
        summary = get_interpretation_summary(results_for_llm)
    except Exception as e:
        logging.exception("LLM interpretation failed.")
        return {"error_message": f"LLM interpretation failed: {e}"}

    return {"ai_summary": summary}
