import os
import argparse
import logging
import json
from typing import List, Tuple, Optional, Dict, Any

# Suppress warnings about unused numpy import, which is necessary for array conversion
# isort: skip_file

# --- New Imports for Phase 2 ---
import cv2
import numpy as np
from skimage.color import rgb2lab
from backend.utils.db import get_db_connection
# -----------------------------

# Type alias
Rect = Tuple[int, int, int, int]

# --- Phase 2: Manual "Answer Key" with RGB values (FILLED) ---
PARAMETER_MAP = [
    {"name": "pH", "values": ["6.0", "6.5", "7.0", "7.5", "8.0", "8.5", "9.0"],
     "rgb": [[232, 114, 88], [232, 145, 99], [235, 180, 107], [216, 196, 116], [186, 186, 111], [168, 161, 114], [147, 142, 109]]},
    {"name": "HARDNESS", "values": ["0", "25", "50", "100", "250", "425"],
     "rgb": [[161, 196, 220], [129, 169, 210], [96, 137, 196], [90, 111, 178], [108, 93, 160], [103, 76, 141]]},
    {"name": "HYDROGEN SULFIDE", "values": ["0", "0.5", "1", "2", "5", "10"],
     "rgb": [[241, 238, 233], [228, 219, 203], [214, 200, 180], [192, 175, 152], [148, 132, 116], [110, 99, 88]]},
    {"name": "IRON", "values": ["0", "0.3", "0.5", "1.0", "3.0", "5.0", "20"],
     "rgb": [[243, 239, 234], [243, 221, 212], [240, 209, 196], [237, 193, 178], [229, 150, 128], [220, 126, 99], [203, 91, 65]]},
    {"name": "COPPER", "values": ["0", "0.1", "0.2", "0.4", "1", "2", "5"],
     "rgb": [[220, 218, 182], [205, 207, 168], [188, 196, 158], [164, 177, 139], [125, 146, 117], [76, 108, 120], [50, 78, 116]]},
    {"name": "LEAD", "values": ["0", "5", "15", "30", "50"],
     "rgb": [[250, 233, 137], [244, 197, 116], [239, 177, 102], [231, 154, 90], [221, 126, 80]]},
    {"name": "MANGANESE", "values": ["0", "0.05", "0.1", "0.5", "1.0", "2.0", "5.0"],
     "rgb": [[246, 235, 174], [239, 192, 160], [234, 173, 161], [223, 146, 149], [207, 118, 137], [190, 95, 128], [174, 79, 120]]},
    {"name": "TOTAL CHLORINE", "values": ["0", "0.5", "1", "3", "5", "10", "20"],
     "rgb": [[251, 240, 159], [218, 220, 137], [186, 199, 125], [140, 172, 115], [105, 149, 110], [78, 130, 112], [61, 118, 112]]},
    {"name": "MERCURY", "values": ["0", "0.002", "0.005", "0.01", "0.02", "0.04", "0.08"],
     "rgb": [[244, 226, 223], [237, 203, 206], [225, 180, 191], [206, 152, 175], [171, 114, 150], [139, 88, 127], [117, 72, 110]]},
    {"name": "NITRATE", "values": ["0", "10", "25", "50", "100", "250", "500"],
     "rgb": [[244, 241, 237], [244, 228, 230], [241, 214, 221], [238, 201, 214], [233, 182, 203], [227, 163, 193], [220, 145, 183]]},
    {"name": "NITRITE", "values": ["0", "1", "5", "10", "20", "40", "80"],
     "rgb": [[244, 241, 237], [245, 231, 231], [240, 212, 216], [235, 194, 203], [227, 173, 188], [215, 149, 171], [201, 126, 153]]},
    {"name": "SULFATE", "values": ["0", "200", "400", "800", "1200", "1600"],
     "rgb": [[213, 210, 229], [196, 207, 229], [178, 196, 226], [159, 183, 220], [140, 170, 213], [123, 158, 207]]},
    {"name": "ZINC", "values": ["0", "5", "10", "30", "50", "100"],
     "rgb": [[235, 204, 202], [214, 161, 162], [200, 137, 144], [128, 120, 161], [102, 109, 158], [79, 94, 150]]},
    {"name": "FLUORIDE", "values": ["0", "10", "25", "50", "100", "1000"],
     "rgb": [[243, 196, 139], [240, 180, 114], [235, 164, 96], [229, 148, 86], [221, 132, 79], [212, 115, 73]]},
    {"name": "SODIUM CHLORIDE", "values": ["0", "100", "250", "500", "1000", "2000"],
     "rgb": [[195, 207, 148], [215, 149, 115], [195, 127, 100], [218, 192, 162], [235, 219, 192], [242, 233, 203]]},
    {"name": "TOTAL ALKALINITY", "values": ["0", "40", "80", "120", "180", "240"],
     "rgb": [[244, 221, 122], [207, 200, 111], [164, 172, 103], [117, 151, 105], [85, 134, 106], [64, 121, 106]]}
]


# ----------------- Utilities (Only essential for manual mode) -----------------

def setup_logging(verbose: bool):
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        level=level,
        format="%(levelname)s: %(message)s",
        handlers=[logging.StreamHandler()]
    )

def get_dominant_lab_color(rgb_array: List[int]) -> List[float]:
    """Calculates the color and returns it in CIELAB."""
    # Convert BGR/RGB to RGB and then to LAB (skimage rgb2lab expects RGB)
    # The input RGB is [R, G, B]
    rgb_pixel = np.array([[rgb_array]], dtype=np.uint8)
    
    # Skimage rgb2lab expects values in [0, 1] range for float or [0, 255] for uint8.
    # Since our RGB is uint8 (0-255), we pass it directly.
    avg_lab_color = rgb2lab(rgb_pixel)[0][0]
    
    return list(avg_lab_color)

def save_to_mongodb(chart_data: List[Dict[str, Any]]):
    """(DEBUG VERSION) Prints the chart data to the console."""
    if not chart_data:
        logging.error("No chart data to save.")
        return

    # Check for DB connection (real save)
    db_conn = get_db_connection()
    if db_conn:
        try:
            collection = db_conn["chart_reference"]
            collection.delete_many({})
            collection.insert_many(chart_data)
            logging.info("🎉 Successfully saved new chart reference to MongoDB!")
            return
        except Exception as e:
            logging.error(f"Failed to save data to MongoDB: {e}. Falling back to print simulation.")

    logging.info("--- 🚀 SIMULATING DATABASE SAVE (DB Connection Failed) 🚀 ---")
    logging.info(f"Would save {len(chart_data)} documents to MongoDB.")
    
    # Print the data
    def convert(o):
        if isinstance(o, np.ndarray):
            return o.tolist()
        return str(o)

    try:
        pretty_data = json.dumps(chart_data, indent=2, default=convert)
        print("\n" + pretty_data + "\n")
        logging.info("🎉 Successfully generated chart reference data!")
    except Exception as e:
         logging.error(f"Error during JSON serialization for printing: {e}")


# ----------------- Main (Manual RGB Conversion) -----------------
def main():
    parser = argparse.ArgumentParser(prog="process_chart.py")
    # Keep only necessary arguments
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose logging")
    parser.add_argument(
        "--save-db",
        action="store_true",
        help="Convert manual RGBs to LAB and save to MongoDB (or print)."
    )
    args = parser.parse_args()

    setup_logging(args.verbose)

    if not args.save_db:
        logging.info("Nothing to do. Use --save-db flag to process the manual RGB data.")
        return

    logging.info("--- Starting Manual RGB Conversion & DB Save ---")

    chart_data_for_db = []
    
    for i, param_info in enumerate(PARAMETER_MAP):
        param_name = param_info["name"]
        param_values = param_info["values"]
        rgb_values = param_info["rgb"]
        
        # --- Validation ---
        if len(param_values) != len(rgb_values):
            logging.error(f"Row {i} ({param_name}): Mismatch between number of values ({len(param_values)}) and number of RGB entries ({len(rgb_values)}). Skipping.")
            continue
        # We skip the check for [0,0,0] since the user has filled everything.

        swatches_data = []
        for j in range(len(param_values)):
            rgb = rgb_values[j]
            value = param_values[j]
            
            # --- Convert RGB to LAB ---
            lab_color = get_dominant_lab_color(rgb)
            
            swatches_data.append({
                "value": value,
                "lab_color": lab_color
            })
            
        chart_data_for_db.append({
            "parameter_name": param_name,
            "row_index": i,
            "swatches": swatches_data
        })

    # Save/Print the final "answer key"
    if chart_data_for_db:
        logging.info(f"Successfully converted RGB data for {len(chart_data_for_db)} parameters.")
        save_to_mongodb(chart_data_for_db)
    else:
        logging.error("No valid RGB data found or processed.")

    logging.info("Processing finished.")

if __name__ == "__main__":
    main()