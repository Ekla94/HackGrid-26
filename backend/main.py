from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import datetime

import models, schemas
from database import SessionLocal, engine

# Create the database tables (creates mandispread.db)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BioChain Direct / MandiSpread AI API",
    description="Backend API for HackGrid 2026",
    version="1.0.0"
)

# Enable CORS so the React frontend can communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all origins (good for local dev)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get a database session for each request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to the MandiSpread API. Go to /docs to see the Swagger UI."}

# ==========================================
# MODULE 2: MandiSpread Arbitrage Engine
# ==========================================

@app.get("/api/arbitrage")
def get_arbitrage_recommendation(crop: str, fpo_location: str, db: Session = Depends(get_db)):
    """
    Takes crop details and calculates the most profitable market.
    """
    distance_km = 150 
    cost_per_km = 40 
    transport_cost = distance_km * cost_per_km
    quantity_kg = 1000 # Default fallback
    
    if crop.lower() == "tomato":
        best_market = "Mumbai"
        price_per_kg = 45.0
    else:
        best_market = "Delhi"
        price_per_kg = 60.0

    gross_revenue = quantity_kg * price_per_kg
    net_profit = gross_revenue - transport_cost

    return {
        "profit": net_profit,
        "market": best_market,
        "details": f"Selling in {best_market} yields highest net profit after deducting ₹{transport_cost} transport costs."
    }

# ==========================================
# MODULE 4: GenAI Smart Contract Desk
# ==========================================

@app.post("/api/contract")
def generate_smart_contract(request: schemas.ContractCreate, db: Session = Depends(get_db)):
    """
    Generates a legally binding contract using AI.
    """
    total_amount = request.tons * 1000 * 50 # Mock calculation (50 rs/kg)

    generated_text = f"""
    SMART CONTRACT AGREEMENT
    ------------------------
    Date: {datetime.datetime.utcnow().strftime("%Y-%m-%d")}
    Seller (FPO): {request.fpo}
    Buyer: {request.buyer}
    
    This agreement certifies the purchase of {request.tons} tons of {request.crop} 
    for a total amount of ₹{total_amount}. 
    
    Terms:
    1. Funds are locked in escrow.
    2. Payment will be released automatically upon geofenced delivery confirmation.
    3. Both parties agree to the quality grade verified by BioTrace.
    """

    # We will just return the text to the frontend for now, 
    # as the DB requires User IDs which we don't have yet.
    return {"contract": generated_text, "status": "DRAFT"}
