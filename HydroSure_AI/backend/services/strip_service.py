# backend/services/strip_service.py
import cv2
import numpy as np
from skimage.color import rgb2lab
from typing import List, Tuple, Dict, Any
import logging
import base64
# Type hint for CIELAB color
LabColor = List[float]

def get_dominant_lab_color(image_roi: np.ndarray) -> LabColor:
    """
    Calculates the average color of an image region (ROI) and converts it to CIELAB.
    Input image_roi is expected to be in BGR format (from OpenCV).
    """
    # 1. Calculate the average color (BGR)
    avg_bgr = np.mean(image_roi, axis=(0, 1))
    
    # 2. Convert BGR to RGB (required by skimage)
    # We create a single pixel array for conversion
    avg_bgr_pixel = np.array([[avg_bgr]], dtype=np.uint8)
    
    # Note: OpenCV's BGR needs to be explicitly converted for external libraries
    avg_rgb_pixel = cv2.cvtColor(avg_bgr_pixel, cv2.COLOR_BGR2RGB)
    
    # 3. Convert RGB to CIELAB
    avg_lab_color = rgb2lab(avg_rgb_pixel)[0][0]
    
    return list(avg_lab_color), list(avg_bgr) # Return LAB and BGR

def segment_strip_pads(strip_image: np.ndarray) -> List[Dict[str, Any]]:
    """
    Segments the water test strip image to isolate the 16 individual test pads.
    
    Returns:
        List of dictionaries, each containing 'pad_image_b64' (for LLM validation) 
        and 'pad_lab_color' (for color matching).
    """
    logging.info("Strip Service: Starting strip segmentation...")
    
    # --- 1. Pre-processing: Focus on Strip Contour ---
    gray = cv2.cvtColor(strip_image, cv2.COLOR_BGR2GRAY)
    
    # Use Otsu's method to segment the object (the strip) from the background
    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    
    # Use a dilation to make the object more solid
    kernel = np.ones((5, 5), np.uint8)
    dilated = cv2.dilate(thresh, kernel, iterations=1)
    
    # --- 2. Find the largest contour (the strip itself) ---
    contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if not contours:
        logging.error("Strip Service: No contours found. Image may be too dark or blurry.")
        raise ValueError("Could not find test strip contour.")
        
    # Find the largest contour by area
    largest_contour = max(contours, key=cv2.contourArea)
    x, y, w, h = cv2.boundingRect(largest_contour)
    
    # Crop the image to just the strip
    strip_roi = strip_image[y:y+h, x:x+w]
    h_roi, w_roi = strip_roi.shape[:2]

    # --- 3. Slice the ROI into 16 pads ---
    # The strip contains 16 pads (pH to Total Alkalinity).
    NUM_PADS = 16
    pad_height = h_roi // NUM_PADS
    
    pad_results = []
    
    for i in range(NUM_PADS):
        pad_y_start = i * pad_height
        pad_y_end = (i + 1) * pad_height
        
        # Ensure the last pad takes up the remaining height
        if i == NUM_PADS - 1:
            pad_y_end = h_roi
            
        pad_image = strip_roi[pad_y_start:pad_y_end, 0:w_roi]
        
        if pad_image.size == 0:
             logging.warning(f"Pad {i} slice resulted in empty image. Skipping.")
             continue
        
        # --- 4. Extract Color and Package Results ---
        
        # Calculate the LAB color from the center half of the pad (to avoid edges)
        center_x_start = w_roi // 4
        center_x_end = w_roi * 3 // 4
        center_y_start = pad_image.shape[0] // 4
        center_y_end = pad_image.shape[0] * 3 // 4
        
        center_roi = pad_image[center_y_start:center_y_end, center_x_start:center_x_end]

        pad_lab_color, pad_bgr_color = get_dominant_lab_color(center_roi)

        # Encode the *full* pad image for LLM verification (Step 5)
        _, buffer = cv2.imencode('.png', pad_image)
        pad_b64 = base64.b64encode(buffer).decode('utf-8')
        
        pad_results.append({
            "index": i,
            "image_b64": pad_b64,
            "lab_color": pad_lab_color,
            "bgr_color": pad_bgr_color
        })

    logging.info("Strip Service: Successfully segmented and processed %d pads.", len(pad_results))
    if len(pad_results) != NUM_PADS:
         logging.error("Strip Service: Segmentation yielded less than 16 pads. Results may be inaccurate.")
         
    return pad_results