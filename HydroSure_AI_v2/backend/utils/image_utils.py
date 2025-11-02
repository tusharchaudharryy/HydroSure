# backend/utils/image_utils.py
import numpy as np
import cv2
import base64
import re
from typing import List
from skimage.color import rgb2lab

def b64_to_cv_image(b64_string: str) -> np.ndarray:
    """
    Converts a Base64 encoded string to an OpenCV image (NumPy array).
    """
    # 1. Decode the Base64 string
    img_bytes = base64.b64decode(b64_string)
    
    # 2. Convert bytes to a NumPy array
    nparr = np.frombuffer(img_bytes, np.uint8)
    
    # 3. Decode the NumPy array into an OpenCV image (BGR format)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if image is None:
        raise ValueError("Could not decode image from Base64 string.")
        
    return image

def get_hex_from_bgr(bgr_color: List[int]) -> str:
    """
    Converts a BGR color list to a web-friendly HEX string.
    """
    # OpenCV uses BGR, we want RGB for HEX display
    b, g, r = [int(c) for c in bgr_color]
    return f'#{r:02x}{g:02x}{b:02x}'

def hex_to_rgb(hex_color: str) -> np.ndarray:
    """
    Converts a HEX color string (e.g., "#E3BBA4") to an RGB NumPy array in [0, 1] range.
    """
    # Clean and validate HEX string
    hex_color = hex_color.strip().lstrip('#')
    if not re.match(r'^[0-9A-Fa-f]{6}$', hex_color):
        # Raise an explicit error so the node can catch it
        raise ValueError(f"Invalid HEX color format: {hex_color}")

    # Convert HEX components to float [0.0, 1.0]
    r = int(hex_color[0:2], 16) / 255.0
    g = int(hex_color[2:4], 16) / 255.0
    b = int(hex_color[4:6], 16) / 255.0
    
    # Return as a NumPy array for skimage.color
    return np.array([r, g, b], dtype=np.float64)

def hex_to_lab(hex_color: str) -> List[float]:
    """
    Converts a HEX color string (e.g., "#E3BBA4") to a CIELAB color list.
    """
    # This is the indented block that was missing
    try:
        # 1. Convert HEX to RGB [0, 1] range
        rgb = hex_to_rgb(hex_color)
        
        # 2. Reshape to 3D array (1, 1, 3) for rgb2lab and convert to LAB
        lab_color = rgb2lab(rgb.reshape(1, 1, 3))[0][0]
        
        return list(lab_color)
    except Exception as e:
        # If hex_to_rgb failed, or lab conversion failed, return black as safe failure
        print(f"Error converting HEX {hex_color} to LAB: {e}")
        return [0.0, 0.0, 0.0]