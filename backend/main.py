from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import datetime
from database import SessionLocal, engine, Base
from models import Contract, ContractStatus
from sqlalchemy.orm import Session
from schemas import BioChainVerifyRequest, RecommendRequest
from models import BioChainVerification
import os
import threading

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="KhetiNex API Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ContractRequest(BaseModel):
    fpo: str
    buyer: str
    crop: str
    tons: int

@app.get("/")
def root():
    return {"status": "ONLINE", "system": "KhetiNex Core Engine"}

@app.get("/api/arbitrage")
def calculate_arbitrage(crop: str, source_city: str, quantity_kg: float):
    # Deterministic wholesale arbitrage calculations
    mandi_rates = {"tomato": {"mumbai": 48.0, "chennai": 32.0, "bangalore": 38.0}}
    base_rate = mandi_rates.get(crop.lower(), {"mumbai": 45.0})["mumbai"]
    
    transport_cost = 150 * 35.0  # 150 km * freight
    gross = quantity_kg * base_rate
    net = gross - transport_cost
    
    return {
        "best_market": "Mumbai APMC",
        "gross_revenue": gross,
        "transport_cost": transport_cost,
        "net_profit": net,
        "recommendation_reason": f"Arbitrage spread yields INR {net:,.2f} net profit after factoring freight."
    }

# We lazy-load the transformers pipeline so it doesn't block server startup
local_generator = None
loading_thread = None

def load_model():
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
        print(f"Failed to load model: {e}")

# Start loading in background
loading_thread = threading.Thread(target=load_model)
loading_thread.start()

@app.post("/api/contract")
def generate_contract(req: ContractRequest, db: Session = Depends(get_db)):
    total = req.tons * 1000 * 48.0
    
    prompt = f"""<|system|>
You are a legal AI assistant. Write professional contracts.
<|user|>
Draft a B2B Agricultural Forward Contract between Seller: {req.fpo} and Buyer: {req.buyer} for {req.tons} MT of {req.crop}. Valuation: INR {total}. Include 30% advance escrow and spoilage limits.
<|assistant|>
"""
    
    text = ""
    global local_generator
    if local_generator is not None:
        try:
            output = local_generator(prompt, max_new_tokens=250, do_sample=True, temperature=0.7)
            generated_text = output[0]['generated_text']
            text = generated_text.split("<|assistant|>\\n")[-1].strip()
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


@app.post('/api/biochain/verify')
def verify_biochain(req: BioChainVerifyRequest, db: Session = Depends(get_db)):
    weights = {'field': 0.15, 'ndvi': 0.20, 'ai': 0.25, 'sensor': 0.25, 'trace': 0.15}
    scores = {
        'field': 1.0 if req.kyc_valid and req.gps_match else 0.0,
        'ndvi': min(req.ndvi_value / 0.8, 1.0),
        'ai': 1.0 - req.pest_probability,
        'sensor': 0.95 if req.chemical_residue < 0.05 else 0.4,
        'trace': 1.0 if req.blockchain_hash else 0.0
    }
    trust_score = int(((scores['field'] * weights['field']) +
                   (scores['ndvi'] * weights['ndvi']) +
                   (scores['ai'] * weights['ai']) +
                   (scores['sensor'] * weights['sensor']) +
                   (scores['trace'] * weights['trace'])) * 100)
    is_verified = trust_score >= 85
    verification = BioChainVerification(
        farmer_id=req.farmer_id, crop_name=req.crop_name, trust_score=trust_score,
        is_verified=is_verified, field_score=scores['field'], ndvi_score=scores['ndvi'],
        ai_score=scores['ai'], sensor_score=scores['sensor'], trace_score=scores['trace']
    )
    db.add(verification)
    db.commit()
    db.refresh(verification)
    return {'trustScore': trust_score, 'isVerified': is_verified, 'breakdown': scores, 'id': verification.id}


@app.post('/api/biochain/recommend')
def recommend_crop_and_buyer(req: RecommendRequest):
    crops = [
        {'name': 'Soybeans', 'soilMatch': 0.9, 'demand': 0.8, 'nutrientDepletion': 0.2},
        {'name': 'Wheat', 'soilMatch': 0.7, 'demand': 0.6, 'nutrientDepletion': 0.6},
        {'name': 'Lentils', 'soilMatch': 0.95, 'demand': 0.85, 'nutrientDepletion': -0.2}
    ]
    crop_scores = []
    for crop in crops:
        penalty = crop['nutrientDepletion'] if req.last_crop == 'Corn' else 0
        score = (0.5 * crop['soilMatch']) + (0.3 * crop['demand']) - (0.2 * penalty)
        crop_scores.append({**crop, 'score': score})
    crop_scores.sort(key=lambda x: x['score'], reverse=True)
    
    buyers = [
        {'name': 'AgriCorp Global', 'distance': 45, 'pricePremium': 1.12, 'qualityReq': 90},
        {'name': 'Local Fresh Co-op', 'distance': 12, 'pricePremium': 1.05, 'qualityReq': 75}
    ]
    buyer_scores = []
    for buyer in buyers:
        distance_penalty = buyer['distance'] * 0.005
        quality_match = 1 if req.current_trust_score >= buyer['qualityReq'] else 0
        score = (buyer['pricePremium'] * quality_match) - distance_penalty
        buyer_scores.append({**buyer, 'score': score})
    buyer_scores.sort(key=lambda x: x['score'], reverse=True)
    
    return {'bestCrop': crop_scores[0], 'bestBuyer': buyer_scores[0]}


@app.get("/api/insights")
def generate_db_insights(db: Session = Depends(get_db)):
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
        
    prompt = f"""<|system|>
You are an expert agricultural data analyst. Summarize the following database records into a short, professional 2-sentence business insight.
<|user|>
Data:
{context}
<|assistant|>
"""
    
    global local_generator
    if local_generator is None:
        return {"insight": "AI model is still loading into memory. Please try again in a few moments!", "raw_data": context}
        
    try:
        output = local_generator(prompt, max_new_tokens=150, do_sample=True, temperature=0.5)
        text = output[0]['generated_text'].split("<|assistant|>\\n")[-1].strip()
    except Exception as e:
        text = f"AI Error: {str(e)}"
        
    return {"insight": text, "raw_data": context}
