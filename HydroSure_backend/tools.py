import numpy as np
from PIL import Image
from langchain_core.tools import tool
from typing import List, Dict, Tuple, Any

# --- Predefined Coordinates ---
# In a real-world application, these would be detected by a computer vision model.
# These coordinates are based on the provided sample images and may need adjustment.
# Format: { name: (x0, y0, x1, y1), ... }

CHART_COLOR_BOXES = {
    'pH': [(70, 35, 110, 60), (140, 35, 180, 60), (210, 35, 250, 60), (280, 35, 320, 60), (350, 35, 390, 60), (420, 35, 460, 60), (490, 35, 530, 60)],
    'Hardness': [(70, 95, 110, 120), (140, 95, 180, 120), (210, 95, 250, 120), (280, 95, 320, 120), (350, 95, 390, 120), (420, 95, 460, 120)],
    'Total Chlorine': [(70, 455, 110, 480), (140, 455, 180, 480), (210, 455, 250, 480), (280, 455, 320, 480), (350, 455, 390, 480), (420, 455, 460, 480)],
    'Nitrate': [(70, 575, 110, 600), (140, 575, 180, 600), (210, 575, 250, 600), (280, 575, 320, 600), (350, 575, 390, 600), (420, 575, 460, 600)],
    'Nitrite': [(70, 635, 110, 660), (140, 635, 180, 660), (210, 635, 250, 660), (280, 635, 320, 660), (350, 635, 390, 660), (420, 635, 460, 660)],
    # Add other parameters here...
}

STRIP_COLOR_PADS = {
    'pH': (200, 45, 240, 65),
    'Hardness': (200, 90, 240, 110),
    'Total Chlorine': (200, 360, 240, 380),
    'Nitrate': (200, 450, 240, 470),
    'Nitrite': (200, 495, 240, 515),
     # Add other parameters here...
}

PARAMETER_VALUES = {
    'pH': [6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0],
    'Hardness': [0, 25, 50, 100, 250, 425],
    'Total Chlorine': [0, 0.5, 1, 3, 5, 10],
    'Nitrate': [0, 10, 25, 50, 100, 250],
    'Nitrite': [0, 1, 5, 10, 20, 40],
    # Add other parameters here...
}

def _get_average_color(image: Image.Image, box: Tuple[int, int, int, int]) -> Tuple[int, int, int]:
    """Helper function to get the average RGB color from a bounding box in an image."""
    region = image.crop(box)
    img_array = np.array(region)
    avg_color = np.mean(img_array, axis=(0, 1))
    return tuple(avg_color.astype(int))

def _color_distance(c1: Tuple[int, int, int], c2: Tuple[int, int, int]) -> float:
    """Calculates the Euclidean distance between two RGB colors."""
    (r1, g1, b1) = c1
    (r2, g2, b2) = c2
    return np.sqrt((r1 - r2)**2 + (g1 - g2)**2 + (b1 - b2)**2)

@tool
def analyze_reference_chart(image_path: str) -> Dict[str, List[Tuple[int, int, int]]]:
    """
    Analyzes the reference color chart image to extract the RGB color values for each parameter.
    
    Args:
        image_path: The file path to the color chart image.

    Returns:
        A dictionary where keys are parameter names (e.g., 'pH') and values are lists of
        the RGB colors from the chart.
    """
    try:
        chart_image = Image.open(image_path).convert('RGB')
    except FileNotFoundError:
        return {"error": f"Chart image not found at {image_path}"}
        
    chart_colors = {}
    for param, boxes in CHART_COLOR_BOXES.items():
        chart_colors[param] = [_get_average_color(chart_image, box) for box in boxes]
        
    return chart_colors

@tool
def analyze_test_strip(image_path: str) -> Dict[str, Tuple[int, int, int]]:
    """
    Analyzes the test strip image to extract the RGB color value for each parameter pad.

    Args:
        image_path: The file path to the test strip image.

    Returns:
        A dictionary where keys are parameter names (e.g., 'pH') and values are the
        single RGB color of the corresponding pad on the strip.
    """
    try:
        strip_image = Image.open(image_path).convert('RGB')
    except FileNotFoundError:
        return {"error": f"Strip image not found at {image_path}"}
    
    strip_colors = {}
    for param, box in STRIP_COLOR_PADS.items():
        strip_colors[param] = _get_average_color(strip_image, box)
        
    return strip_colors

@tool
def interpret_results(
    strip_colors: Dict[str, Tuple[int, int, int]],
    chart_colors: Dict[str, List[Tuple[int, int, int]]]
) -> Dict[str, Any]:
    """
    Compares the test strip colors to the reference chart colors to determine the
    water quality results.

    Args:
        strip_colors: A dictionary of colors extracted from the test strip.
        chart_colors: A dictionary of color scales extracted from the reference chart.

    Returns:
        A dictionary containing the interpreted results for each parameter, including the
        matched value and the color found on the strip.
    """
    results = {}
    for param, strip_color in strip_colors.items():
        if param in chart_colors and param in PARAMETER_VALUES:
            reference_colors = chart_colors[param]
            
            distances = [_color_distance(strip_color, ref_color) for ref_color in reference_colors]
            
            best_match_index = np.argmin(distances)
            matched_value = PARAMETER_VALUES[param][best_match_index]
            
            results[param] = {
                "value": matched_value,
                "unit": "ppm" if param not in ['pH'] else '',
                "color_rgb": strip_color
            }
            
    return results
