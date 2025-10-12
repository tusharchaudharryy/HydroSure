from graph import build_graph

def run_analysis(chart_image: str, strip_image: str):
    """
    Runs the full water test strip analysis workflow.

    Args:
        chart_image: Path to the reference color chart image.
        strip_image: Path to the test strip image.
    """
    # Build the graph
    app = build_graph()

    # Define the inputs for the graph
    inputs = {
        "chart_image_path": chart_image,
        "strip_image_path": strip_image,
    }

    # Invoke the graph and stream events
    print("Starting analysis...\n")
    final_state = None
    for event in app.stream(inputs):
        if "__end__" in event:
            final_state = event["__end__"]
        else:
            (node_name, node_output), = event.items()
            print(f"Finished node: {node_name}")
            # print("Output:", node_output) # Uncomment for detailed output
            print("-" * 30)

    if final_state:
        print("\n--- ANALYSIS COMPLETE ---")
        print(final_state.get("final_summary", "No summary generated."))
    else:
        print("Analysis could not be completed.")

if __name__ == "__main__":
    # --- IMPORTANT ---
    # Replace these with the actual paths to your images.
    # These filenames are based on the images you provided.
    CHART_IMAGE_PATH = "{AEBB1815-ADCA-4138-8E54-AB0005001264}.jpg"
    STRIP_IMAGE_PATH = "WhatsApp Image 2025-09-09 at 23.06.01_50816e85.jpg"
    
    run_analysis(CHART_IMAGE_PATH, STRIP_IMAGE_PATH)

    # --- API Integration Example (using FastAPI) ---
    # To expose this as an API, you could use a framework like FastAPI.
    #
    # 1. Install FastAPI and Uvicorn:
    #    pip install fastapi uvicorn
    #
    # 2. Create a file `api.py`:
    #
    #    from fastapi import FastAPI, UploadFile, File
    #    from main import run_analysis
    #    import shutil
    #
    #    app = FastAPI()
    #
    #    @app.post("/analyze/")
    #    async def analyze_water_quality(chart: UploadFile = File(...), strip: UploadFile = File(...)):
    #        # Save uploaded files temporarily
    #        chart_path = f"temp_{chart.filename}"
    #        strip_path = f"temp_{strip.filename}"
    #
    #        with open(chart_path, "wb") as buffer:
    #            shutil.copyfileobj(chart.file, buffer)
    #        with open(strip_path, "wb") as buffer:
    #            shutil.copyfileobj(strip.file, buffer)
    #
    #        # Run analysis (Note: The current run_analysis prints to console;
    #        # you would modify it to return the final state/summary)
    #        # For a real API, make run_analysis return the result instead of printing.
    #        result = run_analysis_for_api(chart_path, strip_path) # A modified function
    #        return {"results": result}
    #
    # 3. Run the API server:
    #    uvicorn api:app --reload
