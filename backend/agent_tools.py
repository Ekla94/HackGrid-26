import datetime
import random
from sqlalchemy.orm import Session
from models import Contract, BioChainVerification, ContractStatus

def verify_biochain(db: Session, farmer_id: str, crop_name: str):
    # Simulated validation points based on real hackathon metrics
    req_kyc_valid = True
    req_gps_match = True
    req_ndvi_value = random.uniform(0.65, 0.95)
    req_pest_probability = random.uniform(0.01, 0.15)
    req_chemical_residue = random.uniform(0.01, 0.08)
    req_blockchain_hash = f"0x{random.getrandbits(256):064x}"

    weights = {'field': 0.15, 'ndvi': 0.20, 'ai': 0.25, 'sensor': 0.25, 'trace': 0.15}
    scores = {
        'field': 1.0 if req_kyc_valid and req_gps_match else 0.0,
        'ndvi': min(req_ndvi_value / 0.8, 1.0),
        'ai': 1.0 - req_pest_probability,
        'sensor': 0.95 if req_chemical_residue < 0.05 else 0.4,
        'trace': 1.0 if req_blockchain_hash else 0.0
    }
    trust_score = int(sum([scores[k] * weights[k] for k in weights]) * 100)
    is_verified = trust_score >= 85
    
    verification = BioChainVerification(
        farmer_id=farmer_id, crop_name=crop_name, trust_score=trust_score,
        is_verified=is_verified, field_score=scores['field'], ndvi_score=scores['ndvi'],
        ai_score=scores['ai'], sensor_score=scores['sensor'], trace_score=scores['trace']
    )
    db.add(verification)
    db.commit()
    db.refresh(verification)
    
    return {
        "farmer_id": farmer_id,
        "crop": crop_name,
        "trust_score": trust_score,
        "is_verified": is_verified,
        "hash": req_blockchain_hash,
        "breakdown": {
            "field": scores['field'],
            "ndvi": scores['ndvi'],
            "ai": scores['ai'],
            "sensor": scores['sensor'],
            "trace": scores['trace']
        }
    }

def calculate_arbitrage(crop: str, source_city: str, quantity_kg: float):
    # Deterministic wholesale arbitrage
    mandi_rates = {
        "tomato": {"mumbai": 48.0, "chennai": 32.0, "bangalore": 38.0},
        "onion": {"mumbai": 25.0, "nashik": 15.0, "pune": 20.0},
        "potato": {"mumbai": 30.0, "agra": 18.0, "delhi": 22.0}
    }
    
    crop = crop.lower()
    if crop not in mandi_rates:
        crop = "tomato" # Fallback
        
    rates = mandi_rates[crop]
    # Find best market (max price)
    best_market = max(rates, key=rates.get)
    best_rate = rates[best_market]
    
    transport_cost = 150 * 35.0  # mock 150km freight
    gross = quantity_kg * best_rate
    net = gross - transport_cost
    
    # Map coordinates for UI
    city_coords = {
        "mumbai": [19.0760, 72.8777],
        "chennai": [13.0827, 80.2707],
        "bangalore": [12.9716, 77.5946],
        "nashik": [20.0110, 73.7903],
        "pune": [18.5204, 73.8567],
        "agra": [27.1767, 78.0081],
        "delhi": [28.7041, 77.1025]
    }
    
    return {
        "crop": crop.capitalize(),
        "source": source_city.capitalize(),
        "best_market": best_market.capitalize(),
        "quantity_kg": quantity_kg,
        "gross_revenue": gross,
        "transport_cost": transport_cost,
        "net_profit": net,
        "coords": city_coords.get(best_market.lower(), [19.0760, 72.8777])
    }

def draft_smart_contract(db: Session, fpo: str, buyer: str, crop: str, tons: int, ai_model):
    total = tons * 1000 * 48.0
    
    prompt = f"""<|system|>
You are a legal AI assistant. Write professional contracts.
<|user|>
Draft a B2B Agricultural Forward Contract between Seller: {fpo} and Buyer: {buyer} for {tons} MT of {crop}. Valuation: INR {total:,.2f}. Include 30% advance escrow and spoilage limits.
<|assistant|>
"""
    
    text = ""
    if ai_model is not None:
        try:
            output = ai_model(prompt, max_new_tokens=250, do_sample=True, temperature=0.7)
            text = output[0]['generated_text'].split("<|assistant|>\\n")[-1].strip()
        except Exception as e:
            text = f"AI Error: {str(e)}"
    else:
        text = "Model is still loading..."
        
    fallback = '1. Advance Escrow: 30% secured.\n2. Release upon delivery.\n3. 4% Spoilage limit.'
    
    contract_string = f"""====================================================
B2B AGRICULTURAL FORWARD CONTRACT
====================================================
Date: {datetime.datetime.now().strftime('%Y-%m-%d')}
Seller (FPO): {fpo}
Buyer:        {buyer}
Commodity:    {crop.upper()} ({tons} Metric Tons)
Valuation:    INR {total:,.2f}

AI CLAUSES:
{text if text else fallback}
===================================================="""

    new_contract = Contract(
        buyer_id=1, seller_id=2, batch_id=1, total_amount=total,
        contract_text=contract_string, status=ContractStatus.SIGNED, escrow_released=False
    )
    db.add(new_contract)
    db.commit()
    db.refresh(new_contract)
    
    return {
        "contract_id": new_contract.id,
        "contract_text": contract_string,
        "total_value": total
    }

def get_rag_insights(db: Session):
    contracts = db.query(Contract).order_by(Contract.id.desc()).limit(3).all()
    verifications = db.query(BioChainVerification).order_by(BioChainVerification.id.desc()).limit(3).all()
    
    context = "Recent Trades:\\n"
    for c in contracts:
        context += f"Trade #{c.id}: {c.total_amount:,.0f} INR\\n"
    context += "Recent Verifications:\\n"
    for v in verifications:
        context += f"Crop {v.crop_name}: Trust {v.trust_score}%\\n"
        
    return {
        "raw_context": context,
        "trades_analyzed": len(contracts) + len(verifications)
    }
