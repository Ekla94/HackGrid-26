import os

with open('main.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix the generate_contract prompt
bad_contract_prompt = """    prompt = f"<|system|>
You are a legal AI assistant. Write professional contracts.
<|user|>
Draft a B2B Agricultural Forward Contract between Seller: {req.fpo} and Buyer: {req.buyer} for {req.tons} MT of {req.crop}. Valuation: INR {total}. Include 30% advance escrow and spoilage limits.
<|assistant|>
" """

good_contract_prompt = """    prompt = f\"\"\"<|system|>
You are a legal AI assistant. Write professional contracts.
<|user|>
Draft a B2B Agricultural Forward Contract between Seller: {req.fpo} and Buyer: {req.buyer} for {req.tons} MT of {req.crop}. Valuation: INR {total}. Include 30% advance escrow and spoilage limits.
<|assistant|>
\"\"\" """

# Fix the insights prompt
bad_insights_prompt = """    prompt = f"<|system|>
You are an expert agricultural data analyst. Summarize the following database records into a short, professional 2-sentence business insight.
<|user|>
Data:
{context}
<|assistant|>
" """

good_insights_prompt = """    prompt = f\"\"\"<|system|>
You are an expert agricultural data analyst. Summarize the following database records into a short, professional 2-sentence business insight.
<|user|>
Data:
{context}
<|assistant|>
\"\"\" """


text = text.replace(bad_contract_prompt.strip(), good_contract_prompt.strip())
text = text.replace(bad_insights_prompt.strip(), good_insights_prompt.strip())

# Some replacements might not match exactly due to indentation, so let's use a simpler regex
import re
text = re.sub(r'prompt = f"<\|system\|>', r'prompt = f\"\"\"<|system|>', text)
text = re.sub(r'<\|assistant\|>\n"', r'<|assistant|>\n\"\"\"', text)


with open('main.py', 'w', encoding='utf-8') as f:
    f.write(text)
print("Syntax fixed.")
