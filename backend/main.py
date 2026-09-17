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
    }
]

@app.post("/api/agent/chat")
def agent_chat(req: ChatRequest, db: Session = Depends(get_db)):
    xai_key = os.environ.get("XAI_API_KEY")
    if not xai_key:
        return {
            "agent_thought": "Error: XAI_API_KEY is not set.",
            "agent_message": "Please set the XAI_API_KEY environment variable in the backend to use the Grok API generative features.",
            "action_type": "ERROR",
            "payload": {}
        }
    
    msg = req.message
    
    system_prompt = "You are the KhetiNex Agent, an autonomous generative AI assistant for farmers and small businesses. You are a contract regulator, agriculture expert, and problem solver. Use tools to verify crops, calculate arbitrage, draft contracts, or get insights when appropriate. Otherwise, answer questions directly and helpfully."
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {xai_key}"
    }
    
    payload_data = {
        "model": "grok-beta",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": msg}
        ],
        "tools": TOOLS,
        "tool_choice": "auto"
    }
    
    try:
        response = requests.post(
            "https://api.xai.com/v1/chat/completions",
            headers=headers,
            json=payload_data
        )
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        error_details = str(e)
        if 'response' in locals() and hasattr(response, 'text'):
            error_details += f" | Response: {response.text}"
        return {
            "agent_thought": "Failed to call Grok API.",
            "agent_message": f"An error occurred while calling the Grok API: {error_details}",
            "action_type": "ERROR",
            "payload": {}
        }
        
    choice = data.get("choices", [{}])[0]
    message_data = choice.get("message", {})
    
    intent = "CHAT"
    payload = {}
    agent_thought = ""
    agent_message = ""
    
    tool_calls = message_data.get("tool_calls")
    if tool_calls:
        tool_call = tool_calls[0]
        func_name = tool_call.get("function", {}).get("name")
        args_str = tool_call.get("function", {}).get("arguments", "{}")
        try:
            args = json.loads(args_str)
        except:
            args = {}
        
        agent_thought = f"Calling tool {func_name} with arguments {args}"
        
        if func_name == "verify_crop":
            intent = "VERIFIED_CROP"
            payload = agent_tools.verify_biochain(db, args.get("farmer_id", "FMR-007"), args.get("crop_name", "Onions"))
            agent_message = f"I have verified the crop batch for farmer {args.get('farmer_id', 'FMR-007')}. See the profile on the dashboard."
        elif func_name == "calculate_arbitrage":
            intent = "FOUND_ARBITRAGE"
            payload = agent_tools.calculate_arbitrage(args.get("crop_name", "onion"), args.get("source_mandi", "nashik"), float(args.get("quantity_kg", 1000.0)))
            agent_message = f"I've calculated the best arbitrage route for {args.get('quantity_kg', 1000)} kg of {args.get('crop_name', 'onions')}."
        elif func_name == "draft_contract":
            intent = "DRAFTED_CONTRACT"
            payload = agent_tools.draft_smart_contract(db, args.get("fpo_name", "Kisan FPO"), args.get("buyer_name", "Fresh Foods Inc"), args.get("crop_name", "Onions"), int(args.get("quantity_tons", 10)), args.get("clauses", "1. Standard terms apply."))
            agent_message = "I have drafted the smart contract based on your parameters."
        elif func_name == "get_rag_insights":
            intent = "RAG_INSIGHT"
            payload = agent_tools.get_rag_insights(db)
            agent_message = "I've pulled the latest RAG insights from the database."
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
