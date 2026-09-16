from database import SessionLocal, engine, Base
from models import Contract, BioChainVerification, ContractStatus
import random

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if empty
    if db.query(Contract).count() > 0:
        print("Database already seeded.")
        return

    print("Seeding database...")
    crops = ["Tomato", "Onion", "Potato", "Wheat", "Soybeans"]
    
    # Seed 15 Verifications
    for i in range(1, 16):
        v = BioChainVerification(
            farmer_id=f"FMR-10{i}",
            crop_name=random.choice(crops),
            trust_score=random.randint(60, 98),
            is_verified=random.choice([True, False, True, True]),
            field_score=random.uniform(0.5, 1.0),
            ndvi_score=random.uniform(0.6, 1.0),
            ai_score=random.uniform(0.7, 1.0),
            sensor_score=random.uniform(0.5, 0.95),
            trace_score=random.choice([0.0, 1.0])
        )
        db.add(v)

    # Seed 5 Contracts
    for i in range(1, 6):
        c = Contract(
            buyer_id=random.randint(1, 10),
            seller_id=random.randint(1, 10),
            batch_id=i,
            total_amount=random.uniform(50000, 500000),
            contract_text=f"Historical contract #{i} for {random.choice(crops)}.",
            status=ContractStatus.DELIVERED,
            escrow_released=True
        )
        db.add(c)

    db.commit()
    db.close()
    print("Seeding complete.")

if __name__ == "__main__":
    seed_database()
