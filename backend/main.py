from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import datetime

from . import models, schemas
from .database import SessionLocal, engine

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

@app.post("/api/arbitrage/recommend", response_model=schemas.ArbitrageResponse)
def get_arbitrage_recommendation(request: schemas.ArbitrageRequest, db: Session = Depends(get_db)):
    """
    Takes crop details and calculates the most profitable market 
    by simulating transport and toll deductions.
    """
    # MOCK LOGIC for Hackathon Review 1
    # In Phase 2, this will query the database for real market prices
    
    distance_km = 150 
    cost_per_km = 40 
    transport_cost = distance_km * cost_per_km
    
    if request.crop_name.lower() == "tomato":
        best_market = "Mumbai"
        price_per_kg = 45.0
    else:
        best_market = "Delhi"
        price_per_kg = 60.0

    gross_revenue = request.quantity_kg * price_per_kg
    net_profit = gross_revenue - transport_cost

    return {
        "best_market": best_market,
        "gross_revenue": gross_revenue,
        "net_profit": net_profit,
        "transport_cost": transport_cost,
        "recommendation_reason": f"Selling in {best_market} yields the highest net profit after deducting ₹{transport_cost} in transport costs."
    }

# ==========================================
# MODULE 4: GenAI Smart Contract Desk
# ==========================================

@app.post("/api/contracts/generate", response_model=schemas.ContractResponse)
def generate_smart_contract(request: schemas.ContractCreate, db: Session = Depends(get_db)):
    """
    Generates a legally binding contract using AI and saves it to the database.
    """
    # 1. MOCK Gemini API Call for Review 1
    # We use a mocked string here so the frontend can start working immediately.
    # In Phase 2, we will replace this with `google-genai` SDK calls.
    
    generated_text = f"""
    SMART CONTRACT AGREEMENT
    ------------------------
    Date: {datetime.datetime.utcnow().strftime("%Y-%m-%d")}
    Buyer ID: {request.buyer_id}
    Seller ID: {request.seller_id}
    
    This agreement certifies the purchase of Crop Batch #{request.batch_id} 
    for a total amount of ₹{request.total_amount}. 
    
    Terms:
    1. Funds are locked in escrow.
    2. Payment will be released automatically upon geofenced delivery confirmation.
    3. Both parties agree to the quality grade verified by BioTrace.
    """

    # 2. Save the contract to the Database
    db_contract = models.Contract(
        buyer_id=request.buyer_id,
        seller_id=request.seller_id,
        batch_id=request.batch_id,
        total_amount=request.total_amount,
        contract_text=generated_text,
        status=models.ContractStatus.DRAFT
    )
    
    db.add(db_contract)
    db.commit()
    db.refresh(db_contract)

    return db_contract
