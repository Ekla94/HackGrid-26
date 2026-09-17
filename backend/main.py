import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import SessionLocal, engine, Base
from sqlalchemy.orm import Session
import agent_tools
from schemas import ContractCreate
from models import Contract, ContractStatus
import datetime

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

class ChatRequest(BaseModel):
    message: str

@app.post("/api/agent/chat")
def agent_chat(req: ChatRequest, db: Session = Depends(get_db)):
    msg = req.message.lower()
    
    intent = "RAG_INSIGHT"
    if "verify" in msg or "check" in msg or "layer" in msg:
        intent = "VERIFIED_CROP"
    elif "arbitrage" in msg or "margin" in msg or "market" in msg or "best buyer" in msg or "price" in msg or "best" in msg:
        intent = "FOUND_ARBITRAGE"
    elif "yield" in msg or "plant" in msg or "history" in msg or "recommend" in msg or "intelligence" in msg:
        intent = "FARMER_CROP_INTELLIGENCE"
    elif "database" in msg or "schema" in msg or "review" in msg:
        intent = "VIEW_DATABASE"
    elif "contract" in msg or "draft" in msg or "agreement" in msg:
        intent = "DRAFTED_CONTRACT"

    payload = {}
    if intent == "VERIFIED_CROP":
        crop = "Onions" if "onion" in msg else "Tomatoes"
        payload = agent_tools.verify_biochain(db, "FMR-007", crop)
    elif intent == "FOUND_ARBITRAGE":
        crop = "onion" if "onion" in msg else "tomato"
        payload = agent_tools.calculate_arbitrage(crop, "nashik", 1000.0)
    elif intent == "FARMER_CROP_INTELLIGENCE":
        import re
        match = re.search(r"FRM-\d+", msg.upper())
        fid = match.group(0) if match else "FRM-8842"
        payload = agent_tools.get_farmer_history_and_recommendations(fid, db)
    elif intent == "VIEW_DATABASE":
        payload = agent_tools.get_database_summary(db)
    elif intent == "DRAFTED_CONTRACT":
        crop = "Onions" if "onion" in msg else "Tomatoes"
        tons = 500 if "500" in msg else 10
        payload = agent_tools.draft_smart_contract(db, "Kisan FPO", "Fresh Foods Inc", crop, tons, None)
    else:
        payload = agent_tools.get_rag_insights(db)

    agent_thought = f"Detected intent '{intent}'. Executed tool successfully."
    
    if intent == "FOUND_ARBITRAGE":
        agent_message = f"I found the best arbitrage opportunity in {payload.get('best_market', 'your local market')}, yielding a net profit of INR {payload.get('net_profit', 0):,.2f} after transport costs."
    elif intent == "VERIFIED_CROP":
        hash_val = payload.get('hash', '0x00000000')[:10]
        agent_message = f"Verification complete. Trust score is {payload.get('trust_score')}% with Immutable Hash: {hash_val}..."
    elif intent == "FARMER_CROP_INTELLIGENCE":
        agent_message = "I have analyzed the farmer's history and recommended the best crop for rotation to maximize yield and avoid soil depletion."
    elif intent == "DRAFTED_CONTRACT":
        agent_message = f"I have drafted the smart contract. Total valuation is INR {payload.get('total_value', 0):,.2f}."
    else:
        agent_message = "I have extracted the requested insights from the database. Please review the dashboard."

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
B2B AGRICULTURAL FORWARD CONTRACT
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
        buyer_id=1, seller_id=2, batch_id=1, total_amount=total,
        contract_text=text, status=ContractStatus.SIGNED, escrow_released=False
    )
    db.add(new_contract)
    db.commit()
    db.refresh(new_contract)
    return {"contract": text, "status": "SIGNED", "engine": "mock-engine", "contract_id": new_contract.id}

@app.post("/api/biochain/verify")
def biochain_verify(req: dict, db: Session = Depends(get_db)):
    trust_score = 92
    if req.get("ndvi_value", 1.0) < 0.5:
        trust_score = 65
    return {"id": 8842, "trustScore": trust_score, "isVerified": trust_score >= 85}

@app.post("/api/biochain/recommend")
def biochain_recommend(req: dict, db: Session = Depends(get_db)):
    return {
        "bestCrop": {"name": "Soybeans", "score": 0.95},
        "bestBuyer": {"name": "AgriFoods Inc", "pricePremium": 1.15, "qualityReq": 85, "distance": 45}
    }

@app.get("/api/arbitrage")
def get_arbitrage(crop: str = "Tomato", fpo_location: str = "Nashik", quantity_kg: float = 1000.0):
    result = agent_tools.calculate_arbitrage(crop, fpo_location, quantity_kg)
    result["profit"] = result.get("net_profit", 0)
    result["market"] = f"{result.get('best_market')} APMC"
    result["details"] = f"Gross revenue: INR {result.get('gross_revenue', 0):,.0f}, Freight cost: INR {result.get('transport_cost', 0):,.0f}"
    return result

@app.get("/api/logistics")
def get_logistics():
    return {
        "active_fleets": 24,
        "cold_storage_units": 8,
        "avg_freight_per_km": 35.0,
        "monitored_corridors": [
            {"corridor": "Nashik - Mumbai", "distance_km": 165, "transit_hours": 4.5, "status": "OPTIMAL", "cost_inr": 5775},
            {"corridor": "Pune - Mumbai", "distance_km": 150, "transit_hours": 3.8, "status": "OPTIMAL", "cost_inr": 5250},
            {"corridor": "Agra - Delhi", "distance_km": 210, "transit_hours": 4.2, "status": "HEAVY_TRAFFIC", "cost_inr": 7350},
            {"corridor": "Bangalore - Chennai", "distance_km": 340, "transit_hours": 6.5, "status": "OPTIMAL", "cost_inr": 11900}
        ]
    }

