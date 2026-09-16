# main.py (Updated Endpoints)
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import datetime

import models, schemas
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="MandiSpread API", version="1.0.0")

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

# ==========================================
# MODULE 2: MandiSpread Arbitrage Engine
# ==========================================
@app.get("/api/arbitrage", response_model=schemas.ArbitrageResponse)
def get_arbitrage_recommendation(crop: str, source_city: str, quantity_kg: float, db: Session = Depends(get_db)):
    # Your Single Agent mathematical calculation goes here
    distance_km = 150 
    transport_cost = distance_km * 40.0
    
    if crop.lower() == "tomato":
        best_market = "Mumbai"
        price_per_kg = 45.0
    else:
        best_market = "Delhi"
        price_per_kg = 60.0

    gross_revenue = quantity_kg * price_per_kg
    net_profit = gross_revenue - transport_cost

    return schemas.ArbitrageResponse(
        best_market=best_market,
        gross_revenue=gross_revenue,
        net_profit=net_profit,
        transport_cost=transport_cost,
        recommendation_reason=f"Selling in {best_market} yields highest net profit after deducting ₹{transport_cost} for transport."
    )

# ==========================================
# MODULE 4: GenAI Smart Contract Desk
# ==========================================
@app.post("/api/contract")
def generate_smart_contract(request: schemas.ContractCreate, db: Session = Depends(get_db)):
    total_amount = request.tons * 1000 * 50 
    
    # TODO: Replace this string with your Gemini/OpenAI API call
    generated_text = f"""
    SMART CONTRACT AGREEMENT
    ------------------------
    Date: {datetime.datetime.utcnow().strftime("%Y-%m-%d")}
    Seller (FPO): {request.fpo}
    Buyer: {request.buyer}
    
    This agreement certifies the purchase of {request.tons} tons of {request.crop} 
    for a total amount of ₹{total_amount}. 
    """

    return {"contract": generated_text, "status": "DRAFT"}