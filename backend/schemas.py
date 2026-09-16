from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .models import UserRole, ContractStatus

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
    buyer_id: int
    seller_id: int
    batch_id: int
    total_amount: float

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
