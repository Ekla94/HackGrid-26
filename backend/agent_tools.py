import datetime
import random
from sqlalchemy.orm import Session
from models import Contract, Farmer, HarvestRecord, BioChainVerification, ContractStatus

def verify_biochain(db: Session, farmer_id: str, crop_name: str):
    # Simulated validation points based on real hackathon metrics
    req_kyc_valid = True
    req_gps_match = True
    req_ndvi_value = random.uniform(0.65, 0.95)
    req_pest_probability = random.uniform(0.01, 0.15)
    req_chemical_residue = random.uniform(0.01, 0.08)
    req_blockchain_hash = f"0x{random.getrandbits(256):064x}"
    
    # AGMARK Quality Standards Simulation
    agmark_standards = {
        "tomato": {"max_moisture": 0.85, "grade": "Grade A", "min_size_mm": 40},
        "onion": {"max_moisture": 0.12, "grade": "Grade A", "min_size_mm": 35},
        "potato": {"max_moisture": 0.75, "grade": "Grade A", "min_size_mm": 45}
    }
    
    crop = crop_name.lower()
    if crop not in agmark_standards:
        crop = "tomato"
        
    agmark_rules = agmark_standards[crop]
    agmark_compliance_score = random.uniform(0.8, 1.0) # Simulating lab result matching AGMARK

    weights = {'field': 0.10, 'ndvi': 0.15, 'ai': 0.20, 'sensor': 0.20, 'trace': 0.15, 'agmark': 0.20}
    scores = {
        'field': 1.0 if req_kyc_valid and req_gps_match else 0.0,
        'ndvi': min(req_ndvi_value / 0.8, 1.0),
        'ai': 1.0 - req_pest_probability,
        'sensor': 0.95 if req_chemical_residue < 0.05 else 0.4,
        'trace': 1.0 if req_blockchain_hash else 0.0,
        'agmark': agmark_compliance_score
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
        "agmark_grade": agmark_rules["grade"],
        "agmark_moisture_limit": agmark_rules["max_moisture"],
        "breakdown": {
            "field": scores['field'],
            "ndvi": scores['ndvi'],
            "ai": scores['ai'],
            "sensor": scores['sensor'],
            "trace": scores['trace'],
            "agmark": scores['agmark']
        }
    }

def calculate_arbitrage(crop: str, source_city: str, quantity_kg: float):
    # Simulated DMI Agmarknet REST API Data
    # Includes AGMARK quality benchmarks and daily mandi arrivals
    dmi_agmarknet_data = {
        "tomato": {
            "mumbai": {"price": 48.0, "arrival_tons": 1200, "state": "Maharashtra"},
            "chennai": {"price": 32.0, "arrival_tons": 800, "state": "Tamil Nadu"},
            "bangalore": {"price": 38.0, "arrival_tons": 950, "state": "Karnataka"}
        },
        "onion": {
            "mumbai": {"price": 25.0, "arrival_tons": 3000, "state": "Maharashtra"},
            "nashik": {"price": 15.0, "arrival_tons": 5000, "state": "Maharashtra"},
            "pune": {"price": 20.0, "arrival_tons": 2500, "state": "Maharashtra"},
            "delhi": {"price": 28.0, "arrival_tons": 1500, "state": "Delhi"}
        },
        "potato": {
            "mumbai": {"price": 30.0, "arrival_tons": 2000, "state": "Maharashtra"},
            "agra": {"price": 18.0, "arrival_tons": 4000, "state": "UP"},
            "delhi": {"price": 22.0, "arrival_tons": 3000, "state": "Delhi"}
        }
    }
    
    # State APMC Fees & Cess (Static Lookup Table)
    apmc_fees = {
        "Maharashtra": 0.06, # 6% total fee/cess
        "Delhi": 0.02,       # 2% fee
        "Karnataka": 0.04,   # 4% fee
        "Tamil Nadu": 0.03,  # 3% fee
        "UP": 0.05           # 5% fee
    }
    
    crop = crop.lower()
    if crop not in dmi_agmarknet_data:
        crop = "tomato" # Fallback
        
    markets = dmi_agmarknet_data[crop]
    
    # Find best market evaluating Net Price after APMC Fee
    best_market = None
    max_net_rate = 0
    best_state = ""
    
    for city, data in markets.items():
        fee_percent = apmc_fees.get(data["state"], 0.05)
        net_rate = data["price"] * (1 - fee_percent)
        if net_rate > max_net_rate:
            max_net_rate = net_rate
            best_market = city
            best_state = data["state"]
            
    transport_cost = 150 * 35.0  # mock 150km freight
    
    # Calculate totals
    gross_revenue = quantity_kg * markets[best_market]["price"]
    total_apmc_fee = gross_revenue * apmc_fees.get(best_state, 0.05)
    net_profit = gross_revenue - total_apmc_fee - transport_cost
    
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
    
    # WDRA Open Geodata for Cold Storages near destination
    cold_storages = []
    if best_market == "mumbai":
        cold_storages = [{"name": "MahaCold Storage", "coords": [19.1, 72.9]}, {"name": "Vashi APMC Cold", "coords": [19.06, 73.0]}]
    elif best_market == "delhi":
        cold_storages = [{"name": "Azadpur Cold Chain", "coords": [28.73, 77.17]}]
    else:
        cold_storages = [{"name": f"{best_market.capitalize()} Central Cold Storage", "coords": [city_coords.get(best_market, [0,0])[0] + 0.05, city_coords.get(best_market, [0,0])[1] + 0.05]}]
    
    return {
        "crop": crop.capitalize(),
        "source": source_city.capitalize(),
        "best_market": best_market.capitalize(),
        "quantity_kg": quantity_kg,
        "gross_revenue": gross_revenue,
        "apmc_fee_deducted": total_apmc_fee,
        "transport_cost": transport_cost,
        "net_profit": net_profit,
        "coords": city_coords.get(best_market.lower(), [19.0760, 72.8777]),
        "cold_storages": cold_storages
    }

def draft_smart_contract(db: Session, fpo: str, buyer: str, crop: str, tons: int, clauses: str):
    total = tons * 1000 * 48.0
    
    agmark_standards = {
        "tomato": {"max_moisture": 0.85, "grade": "Grade A", "min_size_mm": 40},
        "onion": {"max_moisture": 0.12, "grade": "Grade A", "min_size_mm": 35},
        "potato": {"max_moisture": 0.75, "grade": "Grade A", "min_size_mm": 45}
    }
    agmark_info = agmark_standards.get(crop.lower(), {"max_moisture": 0.85, "grade": "Grade A", "min_size_mm": 40})
    
    default_fallback = f'1. Advance Escrow: 30% secured.\n2. Release upon delivery.\n3. 4% Spoilage limit.\n4. AGMARK Compliance: Must meet {agmark_info["grade"]} standards (Max Moisture: {int(agmark_info["max_moisture"]*100)}%, Min Size: {agmark_info["min_size_mm"]}mm).'
    
    text = clauses if clauses else default_fallback
    
    contract_string = f"""====================================================
B2B AGRICULTURAL FORWARD CONTRACT
====================================================
Date: {datetime.datetime.now().strftime('%Y-%m-%d')}
Seller (FPO): {fpo}
Buyer:        {buyer}
Commodity:    {crop.upper()} ({tons} Metric Tons)
Valuation:    INR {total:,.2f}

AI CLAUSES:
{text}
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


def get_farmer_history_and_recommendations(farmer_identifier: str, db: Session):
    # Find farmer
    farmer = db.query(Farmer).filter((Farmer.farmer_id == farmer_identifier) | (Farmer.name.ilike(f"%{farmer_identifier}%"))).first()
    
    if not farmer:
        # Fallback to a known farmer for the hackathon demo if not found
        farmer = db.query(Farmer).first()

    if not farmer:
        return {"error": "No farmer data found in database."}
        
    # Get farmer's harvest history
    history = db.query(HarvestRecord).filter(HarvestRecord.farmer_id == farmer.farmer_id).order_by(HarvestRecord.harvest_date.desc()).limit(3).all()
    
    last_crop = history[0].crop_name if history else "Unknown"
    last_family = history[0].crop_family if history else "Unknown"
    
    history_timeline = []
    for h in history:
        history_timeline.append({
            "season": h.season,
            "crop": h.crop_name,
            "yield_per_acre": h.yield_per_acre,
            "quality": h.quality_grade,
            "trust": h.trust_score,
            "profit_margin": h.net_profit_margin
        })

    # Regional Benchmark
    regional_harvests = db.query(HarvestRecord).join(Farmer).filter(Farmer.cluster == farmer.cluster).all()
    
    best_yield_record = max(regional_harvests, key=lambda x: x.yield_per_acre, default=None)
    best_quality_record = max(regional_harvests, key=lambda x: x.trust_score, default=None)
    
    regional_benchmark = {
        "highest_yield_crop": best_yield_record.crop_name if best_yield_record else "N/A",
        "highest_yield_value": best_yield_record.yield_per_acre if best_yield_record else 0,
        "highest_quality_crop": best_quality_record.crop_name if best_quality_record else "N/A",
        "highest_quality_value": best_quality_record.trust_score if best_quality_record else 0,
    }

    # Generate Recommendations
    potential_crops = [
        {"crop": "Tomato", "family": "Solanaceae", "base_yield": 125.0, "base_profit": 16.0},
        {"crop": "Onion", "family": "Alliaceae", "base_yield": 105.0, "base_profit": 18.5},
        {"crop": "Chilli", "family": "Solanaceae", "base_yield": 45.0, "base_profit": 22.0},
        {"crop": "Soybean", "family": "Fabaceae", "base_yield": 12.0, "base_profit": 25.0},
    ]
    
    recommendations = []
    for pc in potential_crops:
        # Rotation Logic: 40% penalty if same family
        is_safe = pc["family"] != last_family
        yield_proj = pc["base_yield"] * (1.0 if is_safe else 0.6)
        profit_proj = pc["base_profit"] * (1.0 if is_safe else 0.6)
        
        recommendations.append({
            "crop": pc["crop"],
            "family": pc["family"],
            "projected_yield": round(yield_proj, 1),
            "projected_profit_margin": round(profit_proj, 1),
            "rotation_safe": is_safe,
            "warning": "High risk of soil depletion/pests" if not is_safe else "Optimal for soil health"
        })
        
    # Sort by profit margin
    recommendations.sort(key=lambda x: x["projected_profit_margin"], reverse=True)

    return {
        "farmer_profile": {
            "id": farmer.farmer_id,
            "name": farmer.name,
            "land_size": farmer.land_size_acres,
            "cluster": farmer.cluster,
            "last_crop": last_crop,
            "last_family": last_family
        },
        "history_timeline": history_timeline,
        "regional_benchmark": regional_benchmark,
        "recommended_crops": recommendations
    }


def get_database_summary(db: Session):
    farmers = db.query(Farmer).all()
    harvests = db.query(HarvestRecord).limit(5).all()
    contracts = db.query(Contract).limit(5).all()
    
    return {
        "farmers": [{"id": f.farmer_id, "name": f.name, "cluster": f.cluster, "acres": f.land_size_acres} for f in farmers],
        "harvests": [{"farmer": h.farmer_id, "crop": h.crop_name, "yield": h.yield_per_acre, "grade": h.quality_grade} for h in harvests],
        "contracts": [{"id": c.id, "seller": c.seller_id, "buyer": c.buyer_id, "amount": c.total_amount, "status": c.status.value if hasattr(c.status, 'value') else str(c.status)} for c in contracts]
    }

def report_false_info(db: Session, farmer_id: str, business_name: str, reason: str, proof_url: str):
    from models import DisputeRecord
    
    # Apply standard 30 point deduction
    penalty = 30
    
    dispute = DisputeRecord(
        farmer_id=farmer_id,
        business_name=business_name,
        reason=reason,
        proof_url=proof_url,
        penalty_applied=True,
        points_deducted=penalty
    )
    
    db.add(dispute)
    
    # Find existing verifications and drop trust score
    verifications = db.query(BioChainVerification).filter(BioChainVerification.farmer_id == farmer_id).all()
    new_score = 0
    for v in verifications:
        v.trust_score = max(0, v.trust_score - penalty)
        v.is_verified = False # Strip premium status
        new_score = v.trust_score
        
    db.commit()
    
    return {
        "farmer_id": farmer_id,
        "business": business_name,
        "reason": reason,
        "proof_url": proof_url,
        "penalty_applied": penalty,
        "new_trust_score": new_score,
        "premium_status_revoked": True
    }
