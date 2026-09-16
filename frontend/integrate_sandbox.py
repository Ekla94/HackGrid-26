import os

src = r'c:\Users\Eklavya Srivastava\Desktop\Hackathon\HackGrid-26\frontend\src\MandiRoute\MandiRoute-Buyer-Flow\artifacts\mockup-sandbox\src\components\mockups\mandiroute-buyer-flow\BuyerFlow.tsx'
dst = src

with open(src, 'r', encoding='utf-8') as f:
    content = f.read()

# Only run replacement if we haven't already injected handleGenerateContract
if "handleGenerateContract" not in content:
    content = content.replace('MandiRoute', 'KhetiNex').replace('mandiroute', 'khetinex')

    content = content.replace('export function BuyerFlow() {', '''
export function BuyerFlow() {
  const [contractData, setContractData] = useState(null);
  
  const handleGenerateContract = async (fpo, buyer, crop, tons) => {
    try {
      const res = await fetch("http://localhost:8000/api/contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fpo, buyer, crop, tons: parseInt(tons) || 50 })
      });
      const data = await res.json();
      setContractData(data.contract);
      console.log("Contract generated:", data.contract);
    } catch (e) {
      console.error("API Error:", e);
    }
  };
''')

    content = content.replace(
        'onClick={onNext} icon={ArrowRight}>Accept term sheet',
        'onClick={async () => { await handleGenerateContract("KisanSetu FPO", "Maharashtra Grain Merchants", "Soybean", 180); onNext(); }} icon={ArrowRight}>Accept term sheet'
    )

    content = content.replace(
        'onClick={onNext} icon={ArrowRight}>Accept buyer',
        'onClick={async () => { await handleGenerateContract("Ramesh Patel", "Maharashtra Grain Merchants", "Wheat", 80); onNext(); }} icon={ArrowRight}>Accept buyer'
    )

    with open(dst, 'w', encoding='utf-8') as f:
        f.write(content)
