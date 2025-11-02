# backend/services/match_service.py
import numpy as np
from skimage.color import deltaE_ciede2000
import logging

def calculate_delta_e(color1_lab: list[float], color2_lab: list[float]) -> float:
    """
    Calculates the perceptual difference (Delta E 2000) between two CIELAB colors.
    
    Args:
        color1_lab, color2_lab: CIELAB vectors [L, a, b]
        
    Returns:
        The Delta E score (float). Lower is a better match.
    """
    try:
        # Convert lists to NumPy arrays for the calculation
        # The library expects 3D arrays (1, 1, 3)
        lab1 = np.array(color1_lab, dtype=np.float64).reshape(1, 1, 3)
        lab2 = np.array(color2_lab, dtype=np.float64).reshape(1, 1, 3)
        
        # Calculate Delta E
        delta_e = deltaE_ciede2000(lab1, lab2)[0][0]
        
        # Ensure we return a standard float, not a numpy float
        return float(delta_e)
        
    except Exception as e:
        logging.error(f"Error calculating Delta E: {e}")
        return 999.0 # Return a high (bad) score on failure