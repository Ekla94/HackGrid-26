import os

with open('main.py', 'r', encoding='utf-8') as f:
    content = f.read()

new_endpoint = '''
@app.get("/api/insights")
def generate_db_insights(db: Session = Depends(get_db)):
    from models import Contract, BioChainVerification
    
    # 1. Fetch data from SQLite
    recent_contracts = db.query(Contract).order_by(Contract.id.desc()).limit(3).all()
    recent_verifications = db.query(BioChainVerification).order_by(BioChainVerification.id.desc()).limit(3).all()
    
    # 2. Format DB data into a context string
    context = "Recent Contracts:\\n"
    for c in recent_contracts:
        context += f"- Contract #{c.id}: {c.total_amount:,.2f} INR, Status: {c.status.name if hasattr(c.status, 'name') else c.status}\\n"
        
    context += "\\nRecent BioChain Verifications:\\n"
    for v in recent_verifications:
        context += f"- Farmer {v.farmer_id}: {v.crop_name}, Trust Score: {v.trust_score}/100, Verified: {v.is_verified}\\n"
        
    prompt = f"<|system|>\\nYou are an expert agricultural data analyst. Summarize the following database records into a short, professional 2-sentence business insight.\\n<|user|>\\nData:\\n{context}\\n<|assistant|>\\n"
    
    global local_generator
    if local_generator is None:
        return {"insight": "AI model is still loading into memory. Please try again in a few moments!", "raw_data": context}
        
    try:
        output = local_generator(prompt, max_new_tokens=150, do_sample=True, temperature=0.5)
        text = output[0]['generated_text'].split("<|assistant|>\\n")[-1].strip()
    except Exception as e:
        text = f"AI Error: {str(e)}"
        
    return {"insight": text, "raw_data": context}
'''

if "/api/insights" not in content:
    content += "\n" + new_endpoint
    with open('main.py', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully added /api/insights to main.py")
else:
    print("/api/insights already exists.")
