import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import SessionLocal, engine, Base
from sqlalchemy.orm import Session
import agent_tools
from schemas import ContractCreate
from models import Farmer, HarvestRecord, BioChainVerification, Contract, ContractStatus, SubscriptionTier, BusinessSubscription
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

class UpgradeRequest(BaseModel):
    business_name: str = "Demo Business"

@app.post("/api/subscription/upgrade")
def upgrade_subscription(req: UpgradeRequest, db: Session = Depends(get_db)):
    sub = db.query(BusinessSubscription).filter(BusinessSubscription.business_name == req.business_name).first()
    if not sub:
        sub = BusinessSubscription(business_name=req.business_name, tier=SubscriptionTier.PRO)
        db.add(sub)
    else:
        sub.tier = SubscriptionTier.PRO
    db.commit()
    return {"status": "success", "message": "Upgraded to PRO tier"}

@app.get("/api/subscription/status")
def get_subscription_status(business_name: str = "Demo Business", db: Session = Depends(get_db)):
    sub = db.query(BusinessSubscription).filter(BusinessSubscription.business_name == business_name).first()
    if not sub:
        return {"tier": "free", "is_active": True}
    return {"tier": sub.tier.value, "is_active": sub.is_active}

import json
import requests

# Define tools for Grok API
TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "verify_crop",
            "description": "Verifies a crop batch for a farmer using BioChain.",
            "parameters": {
                "type": "object",
                "properties": {
                    "farmer_id": {"type": "string"},
                    "crop_name": {"type": "string"}
                },
                "required": ["farmer_id", "crop_name"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "calculate_arbitrage",
            "description": "Finds the best market arbitrage for a crop.",
            "parameters": {
                "type": "object",
                "properties": {
                    "crop_name": {"type": "string"},
                    "source_mandi": {"type": "string"},
                    "quantity_kg": {"type": "number"}
                },
                "required": ["crop_name", "source_mandi", "quantity_kg"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "draft_contract",
            "description": "Drafts a B2B smart contract between an FPO and a buyer. You must generate the contract clauses first and pass them to this function.",
            "parameters": {
                "type": "object",
                "properties": {
                    "fpo_name": {"type": "string"},
                    "buyer_name": {"type": "string"},
                    "crop_name": {"type": "string"},
                    "quantity_tons": {"type": "number"},
                    "clauses": {"type": "string", "description": "The generated legal clauses for the contract."}
                },
                "required": ["fpo_name", "buyer_name", "crop_name", "quantity_tons", "clauses"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_rag_insights",
            "description": "Retrieves insights from past trades via RAG.",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "penalize_farmer",
            "description": "Reports false information submitted by a farmer and applies a penalty. Use when a small business provides proof of false crop data.",
            "parameters": {
                "type": "object",
                "properties": {
                    "farmer_id": {"type": "string"},
                    "business_name": {"type": "string"},
                    "reason": {"type": "string"},
                    "proof_url": {"type": "string", "description": "URL to the proof document or image"}
                },
                "required": ["farmer_id", "business_name", "reason", "proof_url"]
            }
        }
    }
]

@app.post("/api/agent/chat")
def agent_chat(req: ChatRequest, db: Session = Depends(get_db)):
    msg = req.message
    
    system_prompt = "You are the KhetiNex Agent, an autonomous generative AI assistant for farmers and small businesses. You are a contract regulator, agriculture expert, and problem solver. Use tools to verify crops, calculate arbitrage, draft contracts, or get insights when appropriate. Otherwise, answer questions directly and helpfully."
    
    headers = {
        "Content-Type": "application/json"
    }
    
    payload_data = {
        "model": "openai",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": msg}
        ],
        "tools": TOOLS,
        "tool_choice": "auto"
    }
    
    try:
        response = requests.post(
            "https://text.pollinations.ai/openai",
            headers=headers,
            json=payload_data
        )
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        error_details = str(e)
        data = {}
        message_data = {}
        
    choice = data.get("choices", [{}])[0] if data else {}
    message_data = choice.get("message", {}) if data else {}
    
    intent = "CHAT"
    payload = {}
    agent_thought = "Offline NLP Mode Active" if not data else ""
    agent_message = "I have processed your request locally." if not data else ""
    
    tool_calls = message_data.get("tool_calls")
    func_name = None
    args = {}
    
    if tool_calls:
        tool_call = tool_calls[0]
        func_name = tool_call.get("function", {}).get("name")
        args_str = tool_call.get("function", {}).get("arguments", "{}")
        try:
            args = json.loads(args_str)
        except:
            args = {}
            
    # Fallback NLP Router if API fails to trigger tool_calls natively (Hackathon safeguard)
    if not func_name:
        msg_lower = msg.lower()
        if "verify" in msg_lower:
            func_name = "verify_crop"
            args = {"farmer_id": "FMR-007", "crop_name": "Onions" if "onion" in msg_lower else "Tomato"}
        elif "arbitrage" in msg_lower or "margin" in msg_lower:
            func_name = "calculate_arbitrage"
            args = {"crop_name": "tomato" if "tomato" in msg_lower else "onion", "source_mandi": "nashik", "quantity_kg": 1000}
        elif "contract" in msg_lower or "draft" in msg_lower:
            func_name = "draft_contract"
            args = {"fpo_name": "Kisan FPO", "buyer_name": "Fresh Foods Inc", "crop_name": "Onions", "quantity_tons": 500}
        elif "insight" in msg_lower or "rag" in msg_lower or "past trade" in msg_lower:
            func_name = "get_rag_insights"
            args = {}
        elif "report" in msg_lower or "false info" in msg_lower or "penalize" in msg_lower:
            func_name = "penalize_farmer"
            args = {"farmer_id": "FMR-007", "business_name": "Anonymous Buyer", "reason": "Reported False Info", "proof_url": "https://link-to-proof"}

    if func_name:
        agent_thought = f"Executing tool: {func_name} with args {args}"
        
        if func_name == "verify_crop":
            intent = "VERIFIED_CROP"
            payload = agent_tools.verify_biochain(db, args.get("farmer_id", "FMR-007"), args.get("crop_name", "Onions"))
            agent_message = f"I have verified the crop batch for farmer {args.get('farmer_id', 'FMR-007')}. See the profile on the dashboard."
        elif func_name == "calculate_arbitrage":
            intent = "FOUND_ARBITRAGE"
            payload = agent_tools.calculate_arbitrage(args.get("crop_name", "onion"), args.get("source_mandi", "nashik"), float(args.get("quantity_kg", 1000.0)))
            agent_message = f"I've calculated the best arbitrage route for {args.get('quantity_kg', 1000)} kg of {args.get('crop_name', 'onions')}."
        elif func_name == "draft_contract":
            if not agent_tools.check_is_pro(db):
                intent = "UPGRADE_REQUIRED"
                payload = {"feature": "AI Smart Contract Drafting", "reason": "Requires KhetiNex PRO"}
                agent_message = "I cannot draft the smart contract. You need a KhetiNex PRO subscription to use this feature."
            else:
                intent = "DRAFTED_CONTRACT"
                payload = agent_tools.draft_smart_contract(db, args.get("fpo_name", "Kisan FPO"), args.get("buyer_name", "Fresh Foods Inc"), args.get("crop_name", "Onions"), int(args.get("quantity_tons", 10)), args.get("clauses", "1. Standard terms apply."))
                agent_message = "I have drafted the smart contract based on your parameters."
        elif func_name == "get_rag_insights":
            if not agent_tools.check_is_pro(db):
                intent = "UPGRADE_REQUIRED"
                payload = {"feature": "Market RAG Insights", "reason": "Requires KhetiNex PRO"}
                agent_message = "I cannot fetch past trade insights. You need a KhetiNex PRO subscription to use this feature."
            else:
                intent = "RAG_INSIGHT"
                payload = agent_tools.get_rag_insights(db)
                agent_message = "I've pulled the latest RAG insights from the database."
        elif func_name == "penalize_farmer":
            intent = "PENALIZED_FARMER"
            payload = agent_tools.report_false_info(db, args.get("farmer_id", "UNKNOWN"), args.get("business_name", "Anonymous Buyer"), args.get("reason", "False Info"), args.get("proof_url", "http://proof.link"))
            agent_message = f"Warning: I have recorded the dispute. {args.get('farmer_id', 'UNKNOWN')}'s trust score has been severely penalized, and their Premium status is revoked."
    else:
        # Generative AI response
        agent_thought = "Generated response using Grok API."
        agent_message = message_data.get("content", "")
        
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

import random
import requests

otp_store = {}

@app.post("/api/auth/otp/generate")
def generate_otp(req: dict):
    phone = req.get("mobile", "unknown")
    # Generate a random 6-digit OTP
    otp_code = str(random.randint(100000, 999999))
    otp_store[phone] = otp_code
    print(f"--- [SMS] SENT TO {phone}: {otp_code} ---")
    return {"status": "success", "message": f"OTP sent to {phone}", "demo_otp": otp_code}

@app.post("/api/auth/otp/verify")
def verify_otp(req: dict):
    phone = req.get("mobile", "unknown")
    otp_code = req.get("otp")
    if otp_store.get(phone) == otp_code:
        return {"status": "success", "verified": True}
    return {"status": "error", "message": "Invalid OTP"}

@app.post("/api/biochain/verify")
def biochain_verify(req: dict, db: Session = Depends(get_db)):
    description = req.get("description", "").lower()
    
    # Send to xAI (Grok) for real analysis if GROK_API_KEY is available
    api_key = os.environ.get("GROK_API_KEY")
    ai_verdict = ""
    trust_score = 92
    
    if api_key:
        try:
            prompt = f"Analyze this farmer's crop description against Indian DMI AGMARK standards. Output a short 2-3 sentence verdict indicating if it meets Fair Average Quality (FAQ). The description is: '{description}'"
            response = requests.post(
                "https://api.x.ai/v1/chat/completions",
                headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                json={
                    "messages": [
                        {"role": "system", "content": "You are a KhetiNex AI Inspector verifying crop data against AGMARK standards."},
                        {"role": "user", "content": prompt}
                    ],
                    "model": "grok-2-latest",
                    "temperature": 0.3
                },
                timeout=10
            )
            data = response.json()
            ai_verdict = data["choices"][0]["message"]["content"]
            if "fail" in ai_verdict.lower() or "not meet" in ai_verdict.lower():
                trust_score = 65
        except Exception as e:
            ai_verdict = ""
            
    # Fallback to local heuristic if Grok API is not available or failed
    if not ai_verdict:
        if "clean" in description or "grade a" in description or "premium" in description:
            ai_verdict = "Harvest parameters analyzed: Mention of 'clean' meets FAQ Grade A parameters. Estimated moisture 10-12%. Verified for dispatch."
        elif "wet" in description or "damaged" in description or "spoil" in description:
            ai_verdict = "Harvest parameters analyzed: Potential quality downgrade detected. Moisture likely exceeds 14% maximum tolerance. Requires manual physical inspection."
            trust_score = 60
        else:
            ai_verdict = "Harvest parameters analyzed: General grade accepted. Subject to standard weighbridge quality deduction protocols upon arrival."
    
    return {
        "id": 8842, 
        "trustScore": trust_score, 
        "isVerified": trust_score >= 85,
        "verdict": ai_verdict
    }

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

