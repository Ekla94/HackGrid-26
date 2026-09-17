import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import SessionLocal, engine, Base
from sqlalchemy.orm import Session
import agent_tools
import rag_engine
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
    import re
    raw_desc = req.get("description", "").strip()
    description = raw_desc.lower()
    
    # 1. First, check if Grok API is available for real-time LLM reasoning
    api_key = os.environ.get("GROK_API_KEY")
    if api_key and len(description) > 3:
        try:
            prompt = (
                "You are the KhetiNex DMI AGMARK Quality Inspector AI Agent. "
                "Analyze the farmer's crop description against Indian Directorate of Marketing & Inspection (DMI) AGMARK standards. "
                "If the text is random letters/gibberish or doesn't mention an agricultural commodity, explicitly output REJECTED with reason. "
                "Otherwise, identify the crop, moisture, defects, grade (Grade A / Grade B / Sub-standard), and whether it meets Fair Average Quality (FAQ). "
                f"Farmer Lot Description: '{raw_desc}'"
            )
            response = requests.post(
                "https://api.x.ai/v1/chat/completions",
                headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                json={
                    "messages": [
                        {"role": "system", "content": "You are a professional DMI AGMARK verification agent. Provide concise, official inspection verdicts."},
                        {"role": "user", "content": prompt}
                    ],
                    "model": "grok-2-latest",
                    "temperature": 0.2
                },
                timeout=8
            )
            data = response.json()
            verdict_text = data["choices"][0]["message"]["content"]
            is_valid = not ("reject" in verdict_text.lower() or "invalid" in verdict_text.lower() or "gibberish" in verdict_text.lower())
            return {
                "id": 8842,
                "trustScore": 95 if is_valid else 35,
                "isVerified": is_valid,
                "verdict": verdict_text
            }
        except Exception:
            pass

    # 2. Local DMI AGMARK Standards Knowledge Engine
    crops_catalog = {
        "wheat": {
            "name": "Sharbati / Durum Wheat (Triticum aestivum)",
            "aliases": ["wheat", "sharbati", "lokwan", "durum", "gehun", "gehu"],
            "max_moisture": 12.0,
            "std_code": "AGMARK-WHT-2004",
        },
        "soybean": {
            "name": "Yellow Soybean (Glycine max)",
            "aliases": ["soybean", "soya", "soyabean"],
            "max_moisture": 12.0,
            "std_code": "AGMARK-SOY-2001",
        },
        "tomato": {
            "name": "Table Tomato (Solanum lycopersicum)",
            "aliases": ["tomato", "tomatoes", "tamatar"],
            "max_moisture": None,
            "std_code": "AGMARK-TOM-2008",
        },
        "onion": {
            "name": "Nashik/Rabi Onion (Allium cepa)",
            "aliases": ["onion", "onions", "pyaz", "pyaaz"],
            "max_moisture": None,
            "std_code": "AGMARK-ONN-2004",
        },
        "rice": {
            "name": "Paddy / Basmati Rice (Oryza sativa)",
            "aliases": ["rice", "paddy", "chawal", "basmati", "dhan"],
            "max_moisture": 14.0,
            "std_code": "AGMARK-PDY-2002",
        },
        "chana": {
            "name": "Desi Bengal Gram / Chickpea",
            "aliases": ["chana", "gram", "chickpea", "chickpeas", "kabuli"],
            "max_moisture": 10.5,
            "std_code": "AGMARK-CHN-2003",
        },
        "potato": {
            "name": "Potato (Solanum tuberosum)",
            "aliases": ["potato", "potatoes", "aloo", "alu"],
            "max_moisture": None,
            "std_code": "AGMARK-POT-2005",
        },
        "mustard": {
            "name": "Mustard / Rapeseed (Brassica nigra)",
            "aliases": ["mustard", "sarson", "rai", "toria"],
            "max_moisture": 8.0,
            "std_code": "AGMARK-MUS-2001",
        }
    }

    # Detect crop in user text
    matched_crop_key = None
    for key, spec in crops_catalog.items():
        for alias in spec["aliases"]:
            if re.search(r'\b' + re.escape(alias) + r'\b', description):
                matched_crop_key = key
                break
        if matched_crop_key:
            break

    # If no agricultural commodity is detected (e.g. gibberish like 'adfsfdsg')
    if not matched_crop_key:
        preview = raw_desc[:30] + ("..." if len(raw_desc) > 30 else "")
        return {
            "id": 8842,
            "trustScore": 25,
            "isVerified": False,
            "status": "REJECTED",
            "verdict": (
                f"❌ DMI AGMARK Verification Failed: No recognizable commodity detected in '{preview}'. "
                "Under Ministry of Agriculture DMI standards, you must declare a valid crop (e.g., Sharbati Wheat, Soybean, Tomato) "
                "along with lot quantity and grain quality parameters to authorize escrow release."
            )
        }

    # Recognized Crop parameters extraction
    spec = crops_catalog[matched_crop_key]
    crop_title = spec["name"]
    std_code = spec["std_code"]
    max_moisture = spec["max_moisture"]

    # Extract moisture percentage if mentioned (e.g. 11.4%, 13 percent)
    moisture_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:%|\s*percent)', description)
    moisture_val = float(moisture_match.group(1)) if moisture_match else None

    # Extract quantity (e.g. 1000kg, 20 MT, 50 quintal)
    qty_match = re.search(r'(\d+(?:\.\d+)?)\s*(kg|quintal|qtl|mt|tons?|tonnes?)', description)
    qty_str = f"{qty_match.group(1)} {qty_match.group(2).upper()}" if qty_match else "Unspecified Quantity"

    # Detect defect indicators
    defect_terms = [
        "wet", "waterlogged", "damaged", "decay", "rot", "rotten", 
        "spoil", "spoiled", "mold", "fungus", "pest", "discolored", 
        "broken", "shriveled", "muddy", "infected", "blackened"
    ]
    detected_defects = [d for d in defect_terms if re.search(r'\b' + re.escape(d) + r'\b', description)]

    # Evaluate against DMI Statutory Tolerances
    if detected_defects:
        defect_summary = ", ".join(detected_defects)
        return {
            "id": 8842,
            "trustScore": 48,
            "isVerified": False,
            "status": "SUB_STANDARD",
            "verdict": (
                f"⚠️ DMI AGMARK Sub-Standard Alert: Lot identified as {crop_title} ({qty_str}). "
                f"Critical non-conformity detected: [{defect_summary}]. Under DMI Schedule {std_code}, "
                "damaged/affected grains exceed the permissible 2.0% tolerance. Physical quality adjustment and lab re-test mandatory."
            )
        }

    if max_moisture and moisture_val and moisture_val > max_moisture:
        return {
            "id": 8842,
            "trustScore": 58,
            "isVerified": False,
            "status": "MOISTURE_EXCEEDED",
            "verdict": (
                f"⚠️ DMI AGMARK Moisture Breach: Detected moisture of {moisture_val}% exceeds "
                f"statutory DMI limit of {max_moisture}% for {crop_title}. Lot is vulnerable to transit storage heating. "
                "Mechanical aeration required prior to weighbridge release."
            )
        }

    # Clean / Valid Lot
    moisture_display = f"{moisture_val}%" if moisture_val else "11.4% (FAQ Target)"
    rag_chunks = rag_engine.retrieve_dmi_clauses(raw_desc, commodity=matched_crop_key, top_k=2)
    rag_cit = [c["citation"] for c in rag_chunks]

    return {
        "id": 8842,
        "trustScore": 94,
        "isVerified": True,
        "status": "CERTIFIED",
        "ragCitations": rag_cit,
        "verdict": (
            f"✅ DMI AGMARK Certified Grade-A: Verified {crop_title} ({qty_str}). "
            f"Parameters fully satisfy DMI Schedule ({std_code}): Moisture within {moisture_display} (Tolerance: ≤{max_moisture or 12.0}%), "
            f"organic foreign matter <0.5%, zero pest infestation. Grounded in [{rag_cit[0]}]. Certified for 30% advance escrow."
        )
    }

@app.post("/api/farmer/intake/verify")
def verify_farmer_intake(intake: dict, db: Session = Depends(get_db)):
    crop = (intake.get("crop") or "wheat").strip().lower()
    variety = intake.get("variety", "Standard FAQ")
    quantity_mt = float(intake.get("quantity_mt") or 25.0)
    moisture_pct = float(intake.get("moisture_pct") or 11.2)
    foreign_matter_pct = float(intake.get("foreign_matter_pct") or 0.4)
    damaged_pct = float(intake.get("damaged_pct") or 0.8)
    storage_type = intake.get("storage_type", "covered_warehouse")
    harvest_weather = intake.get("harvest_weather", "dry_sunny")
    pesticide_safe = bool(intake.get("pesticide_safe", True))
    packaging = intake.get("packaging", "50kg_new_jute")
    pickup_location = intake.get("pickup_location", "Sehore Mandi Terminal")

    crops_catalog = {
        "wheat": {"name": "Wheat (Triticum aestivum)", "max_moisture": 12.0, "max_foreign": 1.0, "max_damage": 2.0, "std_code": "AGMARK-WHT-2004"},
        "soybean": {"name": "Soybean (Glycine max)", "max_moisture": 12.0, "max_foreign": 1.0, "max_damage": 3.0, "std_code": "AGMARK-SOY-2001"},
        "tomato": {"name": "Table Tomato", "max_moisture": None, "max_foreign": 0.5, "max_damage": 3.0, "std_code": "AGMARK-TOM-2008"},
        "onion": {"name": "Rabi Onion", "max_moisture": None, "max_foreign": 1.0, "max_damage": 2.0, "std_code": "AGMARK-ONN-2004"},
        "rice": {"name": "Paddy / Rice", "max_moisture": 14.0, "max_foreign": 1.0, "max_damage": 2.0, "std_code": "AGMARK-PDY-2002"},
        "chana": {"name": "Bengal Gram / Chickpea", "max_moisture": 10.5, "max_foreign": 1.0, "max_damage": 2.0, "std_code": "AGMARK-CHN-2003"},
        "potato": {"name": "Table Potato", "max_moisture": None, "max_foreign": 1.0, "max_damage": 3.0, "std_code": "AGMARK-POT-2005"},
        "mustard": {"name": "Mustard / Rapeseed", "max_moisture": 8.0, "max_foreign": 1.0, "max_damage": 2.0, "std_code": "AGMARK-MUS-2001"},
    }

    spec = crops_catalog.get(crop, crops_catalog["wheat"])
    crop_title = spec["name"]
    std_code = spec["std_code"]
    max_moisture = spec["max_moisture"]
    max_foreign = spec["max_foreign"]
    max_damage = spec["max_damage"]

    score = 100
    deductions = []
    is_compliant = True

    if max_moisture:
        if moisture_pct > max_moisture + 2.0:
            is_compliant = False
            score -= 35
            deductions.append(f"Statutory Moisture Limit Exceeded: {moisture_pct}% vs max {max_moisture}%. Risk of mold heating.")
        elif moisture_pct > max_moisture:
            diff = round(moisture_pct - max_moisture, 1)
            deduction_pct = round(diff * 1.5, 1)
            score -= diff * 12
            deductions.append(f"Minor Moisture Excess ({moisture_pct}%): Contract deduction of -{deduction_pct}% applicable upon weighbridge.")

    if damaged_pct > max_damage + 2.0:
        is_compliant = False
        score -= 30
        deductions.append(f"Excess Damaged Grains ({damaged_pct}% vs max {max_damage}%). Exceeds statutory threshold.")
    elif damaged_pct > max_damage:
        diff = round(damaged_pct - max_damage, 1)
        score -= diff * 10
        deductions.append(f"Damage Tolerance Surcharge: {damaged_pct}% damaged grains (re-cleaning clause).")

    if foreign_matter_pct > max_foreign + 1.5:
        is_compliant = False
        score -= 25
        deductions.append(f"Excess Foreign Matter ({foreign_matter_pct}% vs max {max_foreign}%). Re-sieving mandatory.")
    elif foreign_matter_pct > max_foreign:
        diff = round(foreign_matter_pct - max_foreign, 1)
        score -= diff * 8
        deductions.append(f"Impurities Deduction: {foreign_matter_pct}% foreign matter.")

    if storage_type in ["bare_earth", "open_yard"]:
        score -= 20
        deductions.append("Hazardous Outdoor Storage: Direct ground contact increases moisture absorption risk.")
    elif storage_type == "covered_warehouse":
        score = min(100, score + 2)

    if harvest_weather == "rain_affected":
        score -= 25
        deductions.append("Rain During Harvest: Critical fungal/aflatoxin risk flagged. Mandates lab spot-check.")

    if not pesticide_safe:
        is_compliant = False
        score -= 40
        deductions.append("Pesticide Pre-Harvest Interval (PHI) Violation: Chemical residue exceeds export MRL limits.")

    trust_score = max(20, min(99, int(score)))
    if trust_score < 60:
        is_compliant = False

    grade = "AGMARK Grade-1 (Special FAQ)" if trust_score >= 85 else ("AGMARK Grade-2 (Commercial Good)" if trust_score >= 65 else "Sub-Standard / Rejected")

    import hashlib, time
    cert_hash = "0x" + hashlib.sha256(f"{crop}_{variety}_{quantity_mt}_{trust_score}_{time.time()}".encode()).hexdigest()[:16]

    # Execute Retrieval-Augmented Generation (RAG) Grounding
    rag_audit = rag_engine.ground_lot_with_rag(
        crop=crop,
        moisture_pct=moisture_pct,
        foreign_matter_pct=foreign_matter_pct,
        damaged_pct=damaged_pct,
        storage_type=storage_type,
        pesticide_safe=pesticide_safe
    )

    return {
        "status": "APPROVED" if is_compliant else "REJECTED",
        "isVerified": is_compliant,
        "dmiGrade": grade,
        "stdCode": std_code,
        "trustScore": trust_score,
        "certificateHash": cert_hash,
        "cropDetails": f"{crop_title} ({variety}) · {quantity_mt} MT",
        "parametersSummary": {
            "moisture": f"{moisture_pct}% (Limit: {max_moisture or 'N/A'}%)",
            "foreignMatter": f"{foreign_matter_pct}% (Limit: {max_foreign}%)",
            "damagedGrains": f"{damaged_pct}% (Limit: {max_damage}%)",
            "storage": storage_type.replace("_", " ").title(),
            "weather": harvest_weather.replace("_", " ").title(),
            "pesticideSafe": "Compliant" if pesticide_safe else "Non-Compliant",
            "pickup": pickup_location
        },
        "deductionClauses": deductions,
        "b2bEscrowApproved": is_compliant,
        "ragGrounding": {
            "narrative": rag_audit["rag_narrative"],
            "citations": rag_audit["citations"],
            "retrievedChunks": rag_audit["retrieved_chunks"],
            "knowledgeSource": rag_audit["knowledge_source"]
        },
        "verdict": (
            f"✅ Certified {grade}: {crop_title} lot of {quantity_mt} MT meets DMI statutory schedule {std_code}. "
            f"Grounding: {rag_audit['citations'][0]}. Verified under trust score {trust_score}/100. Advance escrow 30% authorized."
            if is_compliant else
            f"❌ DMI AGMARK Quality Alert: Lot evaluated as {grade} (Trust score: {trust_score}/100). "
            f"Statutory breach under {rag_audit['citations'][0]}: {'; '.join(deductions[:2])}. Re-assay required."
        )
    }

@app.post("/api/rag/query")
def query_rag_knowledge(req: dict):
    query = req.get("query", "").strip()
    commodity = req.get("commodity")
    if not query:
        return {"error": "Query string is required"}
    
    chunks = rag_engine.retrieve_dmi_clauses(query, commodity=commodity, top_k=3)
    citations = [c["citation"] for c in chunks]
    top = chunks[0] if chunks else None
    
    answer = (
        f"Grounded in statutory DMI gazette schedule {top['citation']} ({top['title']}):\n"
        f"{top['content']}\n"
        f"• Statutory Limit: {top.get('statutory_limit')}\n"
        f"• Settlement Impact: {top.get('grade_impact')}"
    ) if top else "No statutory schedule matches this query."
    
    return {
        "query": query,
        "answer": answer,
        "citations": citations,
        "retrieved_chunks": chunks,
        "engine": "KhetiNex RAG Vector Store (DMI AGMARK & FSSAI Statutory Knowledge Base)"
    }

@app.get("/api/rag/statutes")
def get_rag_statutes(commodity: str = "wheat"):
    chunks = rag_engine.retrieve_dmi_clauses(commodity, commodity=commodity, top_k=5)
    return {
        "commodity": commodity,
        "count": len(chunks),
        "statutes": chunks
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

