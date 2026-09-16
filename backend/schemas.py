from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from models import UserRole, ContractStatus

# --- Module 2 Schemas ---

class ArbitrageRequest(BaseModel):
    crop_name: str
    source_city: str
    quantity_kg: float

class ArbitrageResponse(BaseModel):
    best_market: str
    gross_revenue: float
    net_profit: float
    transport_cost: float
    recommendation_reason: str

# --- Module 4 Schemas ---

class ContractCreate(BaseModel):
    fpo: str
    buyer: str
    crop: str
    tons: int

class ContractResponse(BaseModel):
    id: int
    buyer_id: int
    seller_id: int
    batch_id: int
    total_amount: float
    contract_text: str
    status: ContractStatus
    created_at: datetime

    class Config:
        from_attributes = True

class BioChainVerifyRequest(BaseModel):
    farmer_id: str
    crop_name: str
    kyc_valid: bool
    gps_match: bool
    ndvi_value: float
    pest_probability: float
    chemical_residue: float
    blockchain_hash: str

class RecommendRequest(BaseModel):
    farmer_id: str
    last_crop: str
    current_trust_score: int
