import { useState, useEffect } from 'react';
import { MapPin, Satellite, Camera, TestTubes, Link as ChainLink, CheckCircle2, Sprout, TrendingUp, Truck, ShieldCheck } from 'lucide-react';

export default function BioChainDashboard() {
  const [verification, setVerification] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Fetch Verification Profile from Backend
        const verifyRes = await fetch('http://localhost:8000/api/biochain/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            farmer_id: 'FRM-8842',
            crop_name: 'Corn',
            kyc_valid: true,
            gps_match: true,
            ndvi_value: 0.75,
            pest_probability: 0.05,
            chemical_residue: 0.02,
            blockchain_hash: '0xabc123'
          })
        });
        const vResult = await verifyRes.json();
        
        // 2. Fetch Recommendations based on Verification Trust Score
        const recRes = await fetch('http://localhost:8000/api/biochain/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            farmer_id: 'FRM-8842',
            last_crop: 'Corn',
            current_trust_score: vResult.trustScore
          })
        });
        const rResult = await recRes.json();

        setVerification(vResult);
        setRecommendations(rResult);
      } catch (error) {
        console.error("Failed to fetch from backend:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const verificationSteps = [
    { id: 1, title: 'Farmer & Field', icon: MapPin, detail: 'GPS & KYC Matched' },
    { id: 2, title: 'Satellite NDVI', icon: Satellite, detail: 'Biomass Optimal' },
    { id: 3, title: 'AI Inspection', icon: Camera, detail: '95% Healthy Profile' },
    { id: 4, title: 'Sensor / Lab', icon: TestTubes, detail: 'Zero Pesticide Residue' },
    { id: 5, title: 'Traceability', icon: ChainLink, detail: 'Blockchain Hashed' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-green-700 font-semibold flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 animate-spin" /> Fetching Live Data from Backend API...
        </div>
      </div>
    );
  }

  if (!verification || !recommendations) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 font-semibold flex items-center gap-2">
          Failed to connect to backend server. Make sure it is running on port 8000.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6 md:p-12 font-sans text-zinc-300">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Farmer Intelligence Hub</h1>
          <p className="text-zinc-500 mt-2">ID: FRM-8842 • Ramesh Kumar • Nashik Onion FPO</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-zinc-950 rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.05)] border border-amber-500/20 p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-500" /> BioChain 5-Layer Verification
            </h2>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-amber-500/20 before:to-amber-500/80">
              {verificationSteps.map((step) => (
                <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-zinc-950 bg-black text-amber-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ring-1 ring-amber-500/50">
                    <step.icon className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm transition-all hover:shadow-[0_0_15px_rgba(245,158,11,0.1)] hover:border-amber-500/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-zinc-200 text-sm">Layer {step.id}: {step.title}</span>
                      <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-xs text-zinc-500">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-600 to-yellow-800 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.2)] border border-amber-500 p-6 text-white flex flex-col justify-center items-center text-center">
            <p className="text-amber-100 font-medium mb-2">Final Batch Profile</p>
            <div className="w-32 h-32 rounded-full border-8 border-yellow-400 flex items-center justify-center mb-4 bg-black/50 shadow-inner">
              <span className="text-5xl font-bold tracking-tighter text-amber-400">{verification.trustScore}</span>
            </div>
            <h3 className="text-xl font-bold text-white">
              {verification.isVerified ? "VERIFIED PREMIUM" : "STANDARD GRADE"}
            </h3>
            <p className="text-amber-200 text-sm mt-2 px-4">
              Database Record ID: #{verification.id}
            </p>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-white pt-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-500" /> AI Insights & Recommendations
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-950 rounded-2xl shadow-sm border border-amber-500/20 p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-lg">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-zinc-200 font-semibold">Recommended Cropping Pattern</h3>
                <p className="text-xs text-zinc-500">Based on soil depletion history & market demand</p>
              </div>
            </div>
            <div className="mt-auto p-4 bg-zinc-900 rounded-xl border border-zinc-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold text-amber-500">{recommendations.bestCrop.name}</span>
                <span className="text-xs font-semibold px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full">
                  {(recommendations.bestCrop.score * 100).toFixed(0)}% Match
                </span>
              </div>
              <p className="text-sm text-zinc-400">
                Rotating from Corn to <b className="text-white">{recommendations.bestCrop.name}</b> will restore nitrogen levels 
                and take advantage of a projected 15% increase in market demand next quarter.
              </p>
            </div>
          </div>

          <div className="bg-zinc-950 rounded-2xl shadow-sm border border-amber-500/20 p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-lg">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-zinc-200 font-semibold">Best Buyer Match</h3>
                <p className="text-xs text-zinc-500">Optimized for distance, price, and quality</p>
              </div>
            </div>
            <div className="mt-auto p-4 bg-zinc-900 rounded-xl border border-zinc-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold text-amber-500">{recommendations.bestBuyer.name}</span>
                <span className="text-xs font-semibold px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full">
                  {(recommendations.bestBuyer.pricePremium * 100 - 100).toFixed(0)}% Price Premium
                </span>
              </div>
              <p className="text-sm text-zinc-400">
                This buyer explicitly requires BioChain Trust Scores &gt; {recommendations.bestBuyer.qualityReq}. 
                Located only {recommendations.bestBuyer.distance}km away, minimizing logistics costs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
