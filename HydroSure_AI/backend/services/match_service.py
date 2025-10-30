# backend/services/match_service.py
import numpy as np
from skimage.color import rgb2lab, deltaE_ciede2000
from typing import List, Dict, Any

# Define the acceptable Delta E threshold for a high-confidence match
# ΔE < 3.0 is generally considered a perceptually perfect match.
HIGH_CONFIDENCE_THRESHOLD = 3.0

def calculate_delta_e(color1: List[float], color2: List[float]) -> float:
    """
    Calculates the perceptual difference (Delta E 2000) between two CIELAB colors.
    
    Args:
        color1, color2: CIELAB vectors [L, a, b]
        
    Returns:
        The Delta E score (float). Lower is better.
    """
    lab1 = np.array(color1, dtype=np.float64)
    lab2 = np.array(color2, dtype=np.float64)
    
    # deltaE_ciede2000 expects the arrays to be in the shape (1, 3) or (N, 3)
    # We reshape to (1, 3) for the single-color comparison.
    return deltaE_ciede2000(lab1.reshape(1, 3), lab2.reshape(1, 3))[0]


def find_closest_match(pad_color_lab: List[float], chart_swatches: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Compares the test strip pad color to all reference swatches for one parameter
    and finds the closest match using Delta E.
    
    Args:
        pad_color_lab: The CIELAB color of the test strip pad.
        chart_swatches: List of swatches, each with 'value' and 'lab_color'.
        
    Returns:
        A dictionary containing the best match result.
    """
    best_match = None
    min_delta_e = float('inf')

    for swatch in chart_swatches:
        delta_e = calculate_delta_e(pad_color_lab, swatch['lab_color'])
        
        if delta_e < min_delta_e:
            min_delta_e = delta_e
            best_match = swatch

    if best_match:
        # NOTE: We return the raw Delta E as the confidence score. 
        # A lower score means higher confidence.
        return {
            "matched_value": best_match['value'],
            "confidence_score": min_delta_e,
            # We don't have HEX in our DB, so we'll skip it for now or calculate on the fly later
        }
    
    return {
        "matched_value": "N/A",
        "confidence_score": 999.0, # High error score if no match found
    }