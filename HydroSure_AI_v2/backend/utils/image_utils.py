# backend/utils/image_utils.py
import numpy as np
import cv2
import base64
from skimage.color import rgb2lab, hex2rgb # <-- Add hex2rgb

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

# --- ADD THIS NEW FUNCTION ---
def hex_to_lab(hex_color: str) -> list[float]:
    """
    Converts a HEX color string (e.g., "#E3BBA4") to a CIELAB color list.
    """
    try:
        # 1. Convert HEX string to an RGB NumPy array (e.g., [227, 187, 164])
        # hex2rgb returns values from 0-255 as uint8
        rgb_array = hex2rgb(hex_color)
        
        # 2. Convert RGB array to LAB
        # rgb2lab expects a 3D array (height, width, channels)
        lab_color = rgb2lab(rgb_array.reshape(1, 1, 3))[0][0]
        
        return list(lab_color)
    except Exception as e:
        print(f"Error converting HEX {hex_color} to LAB: {e}")
        return [0.0, 0.0, 0.0] # Return black on failure