from database import SessionLocal, engine, Base
from models import Contract, Farmer, HarvestRecord, BioChainVerification, ContractStatus
import random

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if empty
    if db.query(Contract).count() == 0:
        pass # Allow continuation

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
    
    # Seed Farmers and Harvests
    if db.query(Farmer).count() == 0:
        import datetime
        farmers = [
            Farmer(farmer_id="FRM-8842", name="Ramesh Patil", land_size_acres=4.5, cluster="Nashik Cluster"),
            Farmer(farmer_id="FRM-8843", name="Suresh K", land_size_acres=3.2, cluster="Nashik Cluster"),
            Farmer(farmer_id="FRM-8844", name="Prakash Jadhav", land_size_acres=5.0, cluster="Nashik Cluster"),
            Farmer(farmer_id="FRM-9910", name="Gowda M", land_size_acres=2.8, cluster="Kolar Cluster"),
            Farmer(farmer_id="FRM-9911", name="Reddy B", land_size_acres=6.1, cluster="Kolar Cluster")
        ]
        db.add_all(farmers)
        db.commit()

        harvests = [
            HarvestRecord(farmer_id="FRM-8842", crop_name="Tomato", crop_family="Solanaceae", season="Kharif 2024", yield_per_acre=120.0, quality_grade="Grade A+", trust_score=92.5, net_profit_margin=15.0, harvest_date=datetime.date(2024, 10, 15)),
            HarvestRecord(farmer_id="FRM-8842", crop_name="Onion", crop_family="Alliaceae", season="Rabi 2025", yield_per_acre=95.0, quality_grade="Grade A", trust_score=88.0, net_profit_margin=12.5, harvest_date=datetime.date(2025, 4, 10)),
            HarvestRecord(farmer_id="FRM-8843", crop_name="Tomato", crop_family="Solanaceae", season="Kharif 2024", yield_per_acre=110.0, quality_grade="Grade A", trust_score=85.0, net_profit_margin=10.0, harvest_date=datetime.date(2024, 10, 20)),
            HarvestRecord(farmer_id="FRM-8843", crop_name="Chilli", crop_family="Solanaceae", season="Rabi 2025", yield_per_acre=40.0, quality_grade="Grade B", trust_score=75.0, net_profit_margin=8.0, harvest_date=datetime.date(2025, 4, 15)),
            HarvestRecord(farmer_id="FRM-8844", crop_name="Onion", crop_family="Alliaceae", season="Kharif 2024", yield_per_acre=105.0, quality_grade="Grade A+", trust_score=95.0, net_profit_margin=18.0, harvest_date=datetime.date(2024, 11, 5)),
            HarvestRecord(farmer_id="FRM-9910", crop_name="Tomato", crop_family="Solanaceae", season="Kharif 2024", yield_per_acre=140.0, quality_grade="Grade A+", trust_score=96.0, net_profit_margin=20.0, harvest_date=datetime.date(2024, 9, 30)),
            HarvestRecord(farmer_id="FRM-9910", crop_name="Soybean", crop_family="Fabaceae", season="Rabi 2025", yield_per_acre=8.0, quality_grade="Grade A", trust_score=89.0, net_profit_margin=14.0, harvest_date=datetime.date(2025, 3, 20)),
            HarvestRecord(farmer_id="FRM-9911", crop_name="Tomato", crop_family="Solanaceae", season="Kharif 2024", yield_per_acre=135.0, quality_grade="Grade A", trust_score=90.0, net_profit_margin=17.0, harvest_date=datetime.date(2024, 10, 5)),
        ]
        db.add_all(harvests)
        db.commit()

    print("Seeding complete.")

if __name__ == "__main__":
    seed_database()
