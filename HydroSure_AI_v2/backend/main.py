# # backend/main.py
# from fastapi import FastAPI, Request, HTTPException
# from fastapi.responses import JSONResponse
# from contextlib import asynccontextmanager
# import logging
# from backend.core.config import settings
# from backend.api import routes

# # Configure logging
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     """
#     Handles application startup and shutdown events.
#     """
#     logging.info("HydroSure FastAPI application startup.")
#     yield
#     logging.info("HydroSure FastAPI application shutdown.")

# app = FastAPI(
#     title="HydroSure Water Analysis API",
#     description="LangGraph and CV backend for water test strip analysis.",
#     version="1.0.0",
#     lifespan=lifespan
# )

# # --- 1. API Key Middleware for Security (FIXED FOR LOCAL DEV) ---

# @app.middleware("http")
# async def api_key_middleware(request: Request, call_next):
#     # ... (code above remains the same) ...
    
#     api_key_env = settings.FASTAPI_API_KEY
#     api_key_header = request.headers.get("X-API-Key")
    
#     # CRITICAL FIX FOR LOCAL TESTING: Bypass if the key in settings is empty
#     if not api_key_env:
#         # Proceed immediately without checking the header
#         return await call_next(request)

#     # If the key IS set, then proceed with the strict validation
#     if api_key_header != api_key_env:
#         logging.warning("401 Unauthorized attempt with incorrect/missing X-API-Key.")
#         raise HTTPException(status_code=401, detail="Invalid API Key.")

#     # Proceed to the next middleware/route handler
#     response = await call_next(request)
#     return response

# # --- 2. Include API Routes ---
# app.include_router(routes.router)

# if __name__ == "__main__":
#     import uvicorn
#     # Added explicit reload=True here for convenience
#     uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

# #uvicorn backend.main:app --reload

# backend/main.py
from fastapi import FastAPI, Request, HTTPException
from contextlib import asynccontextmanager
import logging
from backend.core.config import settings
from backend.api import routes

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handles application startup and shutdown events.
    """
    logging.info("HydroSure FastAPI application startup.")
    yield
    logging.info("HydroSure FastAPI application shutdown.")

app = FastAPI(
    title="HydroSure Water Analysis API",
    description="LangGraph and CV backend for water test strip analysis.",
    version="1.0.0",
    lifespan=lifespan
)

# --- API Key check DISABLED (always bypassed) ---
@app.middleware("http")
async def api_key_middleware(request: Request, call_next):
    # WARNING: This intentionally bypasses API key validation for all requests.
    # Do NOT use this in production. If you later want to re-enable the check,
    # replace this function with the previous implementation that compares
    # request.headers.get("X-API-Key") to settings.FASTAPI_API_KEY.
    logging.debug("API key middleware: validation disabled — allowing request through.")
    return await call_next(request)

# --- Include API Routes ---
app.include_router(routes.router)

if __name__ == "__main__":
    import uvicorn
    # Added explicit reload=True here for convenience
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

# uvicorn backend.main:app --reload
