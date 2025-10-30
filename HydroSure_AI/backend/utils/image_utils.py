# backend/utils/image_utils.py
import numpy as np
import cv2
import base64
from typing import List   # ✅ required for type hint in get_hex_from_bgr

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
    """Converts a BGR color list to a web-friendly HEX string."""
    # OpenCV uses BGR, we want RGB for HEX display
    b, g, r = [int(c) for c in bgr_color]
    return f'#{r:02x}{g:02x}{b:02x}'
