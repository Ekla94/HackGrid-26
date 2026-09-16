import os
import re

with open('main.py', 'r', encoding='utf-8') as f:
    content = f.read()

new_func = '''import json
import urllib.request
import os

@app.post("/api/contract")
def generate_contract(req: ContractRequest, db: Session = Depends(get_db)):
    total = req.tons * 1000 * 48.0
    
    prompt = f"Draft a secure B2B Agricultural Forward Contract between Seller FPO: {req.fpo} and Buyer: {req.buyer} for {req.tons} Metric Tons of {req.crop}. Total Valuation is INR {total:,.2f}. Include clauses for: 1. Advance Escrow (30%), 2. Weighbridge Release upon delivery, 3. Spoilage Limit capped at 4%. Format it professionally."
    
    # Configuration for Local LLM (e.g., Ollama or LM Studio)
    # Defaulting to Ollama's local OpenAI-compatible endpoint
    local_url = os.environ.get("LOCAL_LLM_URL", "http://localhost:11434/v1/chat/completions")
    local_model = os.environ.get("LOCAL_LLM_MODEL", "llama3")
    
    text = ""
    try:
        data = {
            "model": local_model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7
        }
        req_obj = urllib.request.Request(
            local_url, 
            data=json.dumps(data).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        with urllib.request.urlopen(req_obj, timeout=60) as response:
            result = json.loads(response.read().decode('utf-8'))
            text = result['choices'][0]['message']['content']
    except Exception as e:
        print(f"Local LLM Error: {e}")
        # Try fallback to Ollama native API if OpenAI compatible one fails
        try:
            ollama_url = "http://localhost:11434/api/generate"
            data = {"model": local_model, "prompt": prompt, "stream": False}
            req_obj = urllib.request.Request(ollama_url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
            with urllib.request.urlopen(req_obj, timeout=60) as response:
                result = json.loads(response.read().decode('utf-8'))
                text = result['response']
        except Exception as e2:
            text = f"Local LLM Error: {str(e2)}"
    
    if not text or "Local LLM Error" in text:
        text = f"""====================================================
B2B AGRICULTURAL FORWARD CONTRACT (LOCAL AI ESCROW)
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
[Note: Ensure your Local LLM (e.g. Ollama) is running on port 11434!]
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

    return {"contract": text, "status": "SIGNED", "engine": "local-llm", "contract_id": new_contract.id}
'''

pattern = re.compile(r'@app\.post\(\"/api/contract\"\).*?(?=@app\.post|\Z)', re.DOTALL)
content = pattern.sub(new_func + '\n', content)

content = content.replace('try:\n    from google import genai\nexcept ImportError:\n    genai = None', '')

with open('main.py', 'w', encoding='utf-8') as f:
    f.write(content)
print('Successfully patched for Local LLM.')
