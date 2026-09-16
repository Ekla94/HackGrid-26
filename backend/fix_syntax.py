import re

with open('main.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix generate_contract prompt
content = content.replace('prompt = f"<|system|>\nYou are a legal AI assistant. Write professional contracts.\n<|user|>\nDraft a B2B Agricultural Forward Contract between Seller: {req.fpo} and Buyer: {req.buyer} for {req.tons} MT of {req.crop}. Valuation: INR {total}. Include 30% advance escrow and spoilage limits.\n<|assistant|>\n"', 
                          'prompt = f"""<|system|>\\nYou are a legal AI assistant. Write professional contracts.\\n<|user|>\\nDraft a B2B Agricultural Forward Contract between Seller: {req.fpo} and Buyer: {req.buyer} for {req.tons} MT of {req.crop}. Valuation: INR {total}. Include 30% advance escrow and spoilage limits.\\n<|assistant|>\\n"""')

# Also fix the insights prompt just in case it has the same issue
content = content.replace('prompt = f"<|system|>\nYou are an expert agricultural data analyst', 'prompt = f"""<|system|>\nYou are an expert agricultural data analyst')
# Actually let's just use re.sub for any unclosed prompt f-strings or just replace the specific text.
# Let's see the exact text for insights:
