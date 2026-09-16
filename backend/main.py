import os
import threading
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import SessionLocal, engine, Base
from sqlalchemy.orm import Session
import agent_tools
from schemas import ContractCreate
from models import Contract, ContractStatus
import datetime

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="KhetiNex Agent Engine", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Background LLM Loader
local_generator = None
def load_model():
    global local_generator
    try:
        os.environ['HF_HUB_DISABLE_SYMLINKS_WARNING'] = '1'
        import torch
        from transformers import pipeline
        print("Loading TinyLlama Copilot...")
        local_generator = pipeline("text-generation", model="TinyLlama/TinyLlama-1.1B-Chat-v1.0", device_map="cpu")
        print("Copilot loaded!")
    except Exception as e:
        print(f"Model failed: {e}")

threading.Thread(target=load_model).start()

class ChatRequest(BaseModel):
    message: str

@app.post("/api/agent/chat")
def agent_chat(req: ChatRequest, db: Session = Depends(get_db)):
    global local_generator
    msg = req.message.lower()
    
    intent = "RAG_INSIGHT"
    if "verify" in msg or "check" in msg or "layer" in msg:
        intent = "VERIFIED_CROP"
    elif "arbitrage" in msg or "margin" in msg or "market" in msg or "best buyer" in msg:
        intent = "FOUND_ARBITRAGE"
    elif "contract" in msg or "draft" in msg or "agreement" in msg:
        intent = "DRAFTED_CONTRACT"

    # Execution (Acting)
    payload = {}
    if intent == "VERIFIED_CROP":
        crop = "Onions" if "onion" in msg else "Tomatoes"
        payload = agent_tools.verify_biochain(db, "FMR-007", crop)
    elif intent == "FOUND_ARBITRAGE":
        crop = "onion" if "onion" in msg else "tomato"
        payload = agent_tools.calculate_arbitrage(crop, "nashik", 1000.0)
    elif intent == "DRAFTED_CONTRACT":
        crop = "Onions" if "onion" in msg else "Tomatoes"
        tons = 500 if "500" in msg else 10
        payload = agent_tools.draft_smart_contract(db, "Kisan FPO", "Fresh Foods Inc", crop, tons, local_generator)
    else:
        payload = agent_tools.get_rag_insights(db)

    # Reasoning / Natural Language formatting (via Local LLM)
    agent_message = "Processing your request..."
    agent_thought = f"Detected intent '{intent}'. Executed tool successfully."
    
    if local_generator is not None:
        try:
            # Tightly constrained prompt
            prompt = f"""<|system|>
You are KhetiNex, a strict and concise AI broker. Summarize this data in exactly 1-2 conversational sentences. Speak directly to the user. Do not include any system tags or repeat the data.
<|user|>
Data to summarize: {payload}
<|assistant|>
"""
            # return_full_text=False forces the model to ONLY output the generated answer, removing the prompt entirely!
            output = local_generator(prompt, max_new_tokens=60, do_sample=True, temperature=0.2, top_p=0.9, return_full_text=False)
            agent_message = output[0]['generated_text'].strip()
        except Exception as e:
            agent_message = f"I've successfully executed {intent}, but my language generator encountered an error: {str(e)}"
    else:
        agent_message = f"I've processed your {intent} request, but my language model is still booting up in the background! Please see the visual dashboard for the results."

    return {
        "agent_thought": agent_thought,
        "agent_message": agent_message,
        "action_type": intent,
        "payload": payload
    }

@app.post("/api/contract")
def generate_contract(req: ContractCreate, db: Session = Depends(get_db)):
    total = req.tons * 1000 * 48.0
    text = f"""====================================================
B2B AGRICULTURAL FORWARD CONTRACT (MOCK GENERATOR)
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

    return {"contract": text, "status": "SIGNED", "engine": "mock-engine", "contract_id": new_contract.id}
