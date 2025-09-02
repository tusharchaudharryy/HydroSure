import os

structure = {
    "src": {
        "api": {},
        "assets": {
            "images": {}
        },
        "components": {
            "common": {},
            "layout": {}
        },
        "constants": {},
        "navigation": {},
        "screens": {
            "Auth": {},
            "Home": {},
            "Shop": {},
            "Testing": {},
            "FAQ": {}
        },
        "styles": {},
        "utils": {}
    }
}

base_files = [
    "App.jsx"
]

def create_structure(base_path, structure_dict):
    for name, sub in structure_dict.items():
        dir_path = os.path.join(base_path, name)
        os.makedirs(dir_path, exist_ok=True)
        if isinstance(sub, dict):
            create_structure(dir_path, sub)

def create_files(base_path, files):
    for file in files:
        file_path = os.path.join(base_path, file)
        if not os.path.exists(file_path):
            with open(file_path, "w") as f:
                f.write("// " + file + " template\n")

if __name__ == "__main__":
    root_path = os.getcwd() 
    create_structure(root_path, structure)
    create_files(root_path, base_files)
    print("Project structure created successfully!")
