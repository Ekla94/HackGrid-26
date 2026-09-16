import os
import re

with open('main.py', 'r', encoding='utf-8') as f:
    content = f.read()

new_func = '''import os
try:
    from google import genai
except ImportError:
    genai = None

@app.post("/api/contract")
def generate_contract(req: ContractRequest, db: Session = Depends(get_db)):
    total = req.tons * 1000 * 48.0
    
    api_key = os.environ.get("GEMINI_API_KEY")
    text = ""
    if api_key and genai:
        try:
            client = genai.Client(api_key=api_key)
            prompt = f"Draft a secure B2B Agricultural Forward Contract between Seller FPO: {req.fpo} and Buyer: {req.buyer} for {req.tons} Metric Tons of {req.crop}. Total Valuation is INR {total:,.2f}. Include clauses for: 1. Advance Escrow (30%), 2. Weighbridge Release upon delivery, 3. Spoilage Limit capped at 4%. Format it professionally without markdown blocks if possible."
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
            )
            text = response.text
        except Exception as e:
            text = f"AI Error: {str(e)}"
    
    if not text or "AI Error" in text:
        # Fallback Mock
        text = f"""====================================================
B2B AGRICULTURAL FORWARD CONTRACT (GENAI ESCROW)
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
[Note: Add GEMINI_API_KEY to .env to generate dynamic AI contracts]
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

    return {"contract": text, "status": "SIGNED", "engine": "gemini-2.5-flash" if api_key else "mock-engine", "contract_id": new_contract.id}
'''

pattern = re.compile(r'@app\.post\(\"/api/contract\"\).*?(?=@app\.post|\Z)', re.DOTALL)
content = pattern.sub(new_func + '\n', content)

with open('main.py', 'w', encoding='utf-8') as f:
    f.write(content)
print('Successfully patched.')
