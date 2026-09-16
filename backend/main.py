from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import datetime

app = FastAPI(title="MandiSpread API Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ContractRequest(BaseModel):
    fpo: str
    buyer: str
    crop: str
    tons: int

@app.get("/")
def root():
    return {"status": "ONLINE", "system": "MandiSpread Core Engine"}

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
        "recommendation_reason": f"Arbitrage spread yields ₹{net:,.2f} net profit after factoring freight."
    }

@app.post("/api/contract")
def generate_contract(req: ContractRequest):
    total = req.tons * 1000 * 48.0
    text = f"""====================================================
B2B AGRICULTURAL FORWARD CONTRACT (GENAI ESCROW)
====================================================
Date: {datetime.datetime.now().strftime("%Y-%m-%d")}
Seller (FPO): {req.fpo}
Buyer:        {req.buyer}
Commodity:    {req.crop.upper()} ({req.tons} Metric Tons)
Valuation:    INR {total:,.2f}

AI CLAUSE GENERATION:
1. Advance Escrow: 30% secured prior to transit dispatch.
2. Weighbridge Release: 70% released upon physical mandi delivery.
3. Spoilage Limit: Maximum allowable transit loss capped at 4%.
===================================================="""
    return {"contract": text, "status": "DRAFT", "engine": "genai-edge-node"}