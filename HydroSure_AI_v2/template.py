import os
import textwrap

PROJECT_ROOT = "color_match_ai"

DIRECTORIES = [
    os.path.join(PROJECT_ROOT, "backend"),
    os.path.join(PROJECT_ROOT, "backend/api"),
    os.path.join(PROJECT_ROOT, "backend/core"),
    os.path.join(PROJECT_ROOT, "backend/services"),
    os.path.join(PROJECT_ROOT, "backend/langgraph_workflow"),
    os.path.join(PROJECT_ROOT, "backend/models"),
    os.path.join(PROJECT_ROOT, "backend/utils"),
    os.path.join(PROJECT_ROOT, "scripts"),
    os.path.join(PROJECT_ROOT, "data/chart_samples"),
    os.path.join(PROJECT_ROOT, "data/strip_samples"),
]

EMPTY_FILES = [
    os.path.join(PROJECT_ROOT, "backend/__init__.py"),
    os.path.join(PROJECT_ROOT, "backend/api/__init__.py"),
    os.path.join(PROJECT_ROOT, "backend/core/__init__.py"),
    os.path.join(PROJECT_ROOT, "backend/services/__init__.py"),
    os.path.join(PROJECT_ROOT, "backend/langgraph_workflow/__init__.py"),
    os.path.join(PROJECT_ROOT, "backend/models/__init__.py"),
    os.path.join(PROJECT_ROOT, "backend/utils/__init__.py"),
    os.path.join(PROJECT_ROOT, "scripts/__init__.py"),

    os.path.join(PROJECT_ROOT, "backend/main.py"),
    os.path.join(PROJECT_ROOT, "backend/api/routes.py"),
    os.path.join(PROJECT_ROOT, "backend/api/schemas.py"),
    os.path.join(PROJECT_ROOT, "backend/core/config.py"),
    os.path.join(PROJECT_ROOT, "backend/services/chart_service.py"),
    os.path.join(PROJECT_ROOT, "backend/services/strip_service.py"),
    os.path.join(PROJECT_ROOT, "backend/services/match_service.py"),
    os.path.join(PROJECT_ROOT, "backend/services/llm_service.py"),
    os.path.join(PROJECT_ROOT, "backend/langgraph_workflow/graph.py"),
    os.path.join(PROJECT_ROOT, "backend/langgraph_workflow/nodes.py"),
    os.path.join(PROJECT_ROOT, "backend/models/db_models.py"),
    os.path.join(PROJECT_ROOT, "backend/utils/db.py"),
    os.path.join(PROJECT_ROOT, "backend/utils/image_utils.py"),

    os.path.join(PROJECT_ROOT, "scripts/process_chart.py"),
    
    os.path.join(PROJECT_ROOT, "data/chart_samples/.gitkeep"),
    os.path.join(PROJECT_ROOT, "data/strip_samples/.gitkeep"),

    os.path.join(PROJECT_ROOT, "README.md"),
]

REQUIREMENTS_CONTENT = textwrap.dedent("""
    fastapi
    uvicorn[standard]
    pydantic
    python-dotenv

    # LangGraph and AI
    langgraph
    openai

    # Computer Vision
    opencv-python
    scikit-image
    numpy
    
    # Database
    pymongo
""")

GITIGNORE_CONTENT = textwrap.dedent("""
    # Python
    __pycache__/
    *.pyc
    .env
    venv/
    .idea/
    
    # Data (if they get large)
    # data/processed/

    # OS
    .DS_Store
""")

ENV_EXAMPLE_CONTENT = textwrap.dedent("""
    # --- API Keys ---
    OPENAI_API_KEY="sk-..."
    
    # --- Database ---
    MONGO_URI="your_mongodb_connection_string"
    MONGO_DB_NAME="hydro_sure_db"
    
    # --- Security ---
    FASTAPI_API_KEY="my-secret-key-12345"
""")

def create_scaffold():
    """Creates the project directory structure, files, and content."""
    
    print(f" Starting to build project structure for '{PROJECT_ROOT}'...")

    if not os.path.exists(PROJECT_ROOT):
        os.makedirs(PROJECT_ROOT)
        print(f"Created root: {PROJECT_ROOT}")

    for dir_path in DIRECTORIES:
        if not os.path.exists(dir_path):
            os.makedirs(dir_path)
            print(f"  Created dir:  {dir_path}")

    for file_path in EMPTY_FILES:
        if not os.path.exists(file_path):
            with open(file_path, 'a') as f:
                pass  
            print(f"  Created file: {file_path}")

    files_with_content = {
        os.path.join(PROJECT_ROOT, "requirements.txt"): REQUIREMENTS_CONTENT,
        os.path.join(PROJECT_ROOT, ".gitignore"): GITIGNORE_CONTENT,
        os.path.join(PROJECT_ROOT, ".env.example"): ENV_EXAMPLE_CONTENT,
    }

    for file_path, content in files_with_content.items():
        if not os.path.exists(file_path):
            with open(file_path, 'w') as f:
                f.write(content)
            print(f"  Populated:  {file_path}")
        
    print("\n Project scaffolding complete!")
    print(f"Next steps:")
    print(f"1. cd {PROJECT_ROOT}")
    print(f"2. (Optional) Create a virtual environment: python -m venv venv")
    print(f"3. Install dependencies: pip install -r requirements.txt")
    print(f"4. Create a '.env' file (copy .env.example) and add your API keys.")

if __name__ == "__main__":
    create_scaffold()
