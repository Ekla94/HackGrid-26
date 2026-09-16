import os

with open('main.py', 'r', encoding='utf-8') as f:
    content = f.read()

old_func = """def load_model():
    global local_generator
    try:
        from transformers import pipeline
        print("Loading HuggingFace Transformers model in the background...")
        local_generator = pipeline("text-generation", model="TinyLlama/TinyLlama-1.1B-Chat-v1.0", device_map="auto")
        print("Model loaded successfully!")
    except Exception as e:
        print(f"Failed to load model: {e}")"""

new_func = """def load_model():
    global local_generator
    try:
        import os
        os.environ['HF_HUB_DISABLE_SYMLINKS_WARNING'] = '1'
        import torch
        from transformers import pipeline
        print("Loading HuggingFace Transformers model in the background...")
        local_generator = pipeline("text-generation", model="TinyLlama/TinyLlama-1.1B-Chat-v1.0", device_map="cpu")
        print("Model loaded successfully!")
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Failed to load model: {e}")"""

if old_func in content:
    content = content.replace(old_func, new_func)
    with open('main.py', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed load_model")
else:
    print("Could not find the old function in main.py to replace.")
