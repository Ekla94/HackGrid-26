import os
import re

with open('main.py', 'r', encoding='utf-8') as f:
    content = f.read()

new_func = '''import os
import threading

# We lazy-load the transformers pipeline so it doesn't block server startup
local_generator = None
loading_thread = None

def load_model():
    global local_generator
    try:
        from transformers import pipeline
        print("Loading HuggingFace Transformers model in the background...")
        # Using TinyLlama for fast CPU/GPU loading during hackathons (approx 2.2GB)
        local_generator = pipeline("text-generation", model="TinyLlama/TinyLlama-1.1B-Chat-v1.0", device_map="auto")
        print("Model loaded successfully!")
    except Exception as e:
        print(f"Failed to load model: {e}")

# Start loading in background
loading_thread = threading.Thread(target=load_model)
loading_thread.start()

@app.post("/api/contract")
def generate_contract(req: ContractRequest, db: Session = Depends(get_db)):
    total = req.tons * 1000 * 48.0
    
    prompt = f"<|system|>\nYou are a legal AI assistant. Write professional contracts.\n<|user|>\nDraft a B2B Agricultural Forward Contract between Seller: {req.fpo} and Buyer: {req.buyer} for {req.tons} MT of {req.crop}. Valuation: INR {total}. Include 30% advance escrow and spoilage limits.\n<|assistant|>\n"
    
    text = ""
    global local_generator
    if local_generator is not None:
        try:
            # Generate text using the loaded transformers model
            output = local_generator(prompt, max_new_tokens=250, do_sample=True, temperature=0.7)
            generated_text = output[0]['generated_text']
            # Clean up prompt from output
            text = generated_text.split("<|assistant|>\n")[-1].strip()
        except Exception as e:
            text = f"Transformers AI Error: {str(e)}"
    else:
        text = "Model is still downloading/loading in the background via transformers... Please try again in a few moments."
    
    if not text or "Transformers AI Error" in text or "loading" in text:
        text = f"""====================================================
B2B AGRICULTURAL FORWARD CONTRACT (TRANSFORMERS LOCAL AI)
====================================================
Date: {datetime.datetime.now().strftime('%Y-%m-%d')}
Seller (FPO): {req.fpo}
Buyer:        {req.buyer}
Commodity:    {req.crop.upper()} ({req.tons} Metric Tons)
Valuation:    INR {total:,.2f}

AI CLAUSE GENERATION:
1. Advance Escrow: 30% secured prior to transit dispatch.
2. Weighbridge Release: 70% released upon physical mandi delivery.
3. Spoilage Limit: Maximum allowable transit loss capped at 4%.

[Status: {text}]
===================================================="""
    
    new_contract = Contract(
        buyer_id=1,
        seller_id=2,
        batch_id=1,
        total_amount=total,
        contract_text=text,
        status=ContractStatus.SIGNED,
        escrow_released=False
    )
    db.add(new_contract)
    db.commit()
    db.refresh(new_contract)

    return {"contract": text, "status": "SIGNED", "engine": "transformers-pipeline", "contract_id": new_contract.id}
'''

pattern = re.compile(r'@app\.post\(\"/api/contract\"\).*?(?=@app\.post|\Z)', re.DOTALL)
content = pattern.sub(new_func + '\n', content)

# Remove the old local LLM code bits if they conflict
content = content.replace('import urllib.request\n', '')
content = content.replace('import json\n', '')

with open('main.py', 'w', encoding='utf-8') as f:
    f.write(content)
print('Successfully patched for Transformers Pipeline.')
