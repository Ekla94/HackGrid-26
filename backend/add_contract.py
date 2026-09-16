import os
import re

with open('main.py', 'r', encoding='utf-8') as f:
    content = f.read()

if 'ContractCreate' not in content:
    content = content.replace('import agent_tools', 'import agent_tools\nfrom schemas import ContractCreate\nfrom models import Contract, ContractStatus\nimport datetime')

if '@app.post(\"/api/contract\")' not in content:
    new_func = '''
@app.post(\"/api/contract\")
def generate_contract(req: ContractCreate, db: Session = Depends(get_db)):
    total = req.tons * 1000 * 48.0
    text = f\"\"\"====================================================
B2B AGRICULTURAL FORWARD CONTRACT (MOCK GENERATOR)
====================================================
Date: {datetime.datetime.now().strftime('%Y-%m-%d')}
Seller (FPO): {req.fpo}
Buyer:        {req.buyer}
Commodity:    {req.crop.upper()} ({req.tons} Metric Tons)
Valuation:    INR {total:,.2f}

AI CLAUSE GENERATION:
1. Advance Escrow: 30% secured prior to transit dispatch.
2. Weighbridge Release: 70% released upon physical mandi delivery.
3. Spoilage Limit: Maximum allowable transit loss capped at 4%.
====================================================\"\"\"
    
    new_contract = Contract(
        buyer_id=1,
        seller_id=2,
        batch_id=1,
        total_amount=total,
        contract_text=text,
        status=ContractStatus.SIGNED,
        escrow_released=False
    )
    db.add(new_contract)
    db.commit()
    db.refresh(new_contract)

    return {\"contract\": text, \"status\": \"SIGNED\", \"engine\": \"mock-engine\", \"contract_id\": new_contract.id}
'''
    content += new_func

with open('main.py', 'w', encoding='utf-8') as f:
    f.write(content)
print('Successfully added /api/contract endpoint')
