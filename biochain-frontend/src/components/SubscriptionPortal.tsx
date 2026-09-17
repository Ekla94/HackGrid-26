import { useState } from 'react';

interface SubscriptionPortalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function SubscriptionPortal({ onClose, onSuccess }: SubscriptionPortalProps) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/subscription/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ business_name: 'Demo Business' }),
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        onSuccess();
      }
    } catch (error) {
      console.error('Upgrade failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
      <div className="bg-zinc-950 border border-amber-500/30 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="relative p-6 border-b border-amber-500/20 bg-gradient-to-r from-amber-900/40 to-transparent">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-zinc-400 hover:text-white transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <h2 className="text-3xl font-black text-white flex items-center gap-2">
            Upgrade to KhetiNex <span className="bg-amber-500 text-black px-2 py-0.5 rounded text-2xl uppercase">Pro</span>
          </h2>
          <p className="text-amber-500/80 mt-2">Unlock unlimited AI power and deep market analytics.</p>
        </div>

        {/* Pricing Cards */}
        <div className="p-8 grid md:grid-cols-2 gap-8">
          
          {/* Free Tier */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 opacity-70">
            <h3 className="text-xl font-bold text-white mb-1">Standard</h3>
            <div className="text-4xl font-black text-zinc-500 mb-6">Free</div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-sm text-zinc-400"><svg className="w-5 h-5 mr-3 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Basic Crop Verification</li>
              <li className="flex items-center text-sm text-zinc-400"><svg className="w-5 h-5 mr-3 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Limited Copilot Queries</li>
              <li className="flex items-center text-sm text-zinc-400"><svg className="w-5 h-5 mr-3 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Live Mandi Prices</li>
            </ul>
            
            <button disabled className="w-full py-3 bg-zinc-800 text-zinc-500 rounded-lg font-bold cursor-not-allowed">
              Current Plan
            </button>
          </div>

          {/* Pro Tier */}
          <div className="bg-zinc-900 border-2 border-amber-500 rounded-xl p-6 relative transform scale-105 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
            <div className="absolute top-0 right-0 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg uppercase tracking-wider">
              Recommended
            </div>
            <h3 className="text-xl font-bold text-amber-500 mb-1">Business Pro</h3>
            <div className="text-4xl font-black text-white mb-2">₹1,999<span className="text-lg text-zinc-500 font-normal">/mo</span></div>
            <p className="text-sm text-zinc-400 mb-6 border-b border-zinc-800 pb-4">For buyers and FPOs managing high volumes.</p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-sm text-white font-medium"><svg className="w-5 h-5 mr-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Unlimited RAG Trade Insights</li>
              <li className="flex items-center text-sm text-white font-medium"><svg className="w-5 h-5 mr-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> AI Smart Contract Drafting</li>
              <li className="flex items-center text-sm text-white font-medium"><svg className="w-5 h-5 mr-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Advanced Cold Storage Arbitrage</li>
              <li className="flex items-center text-sm text-white font-medium"><svg className="w-5 h-5 mr-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Priority Verification Disputes</li>
            </ul>
            
            <button 
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black rounded-lg font-bold transition-all shadow-lg hover:shadow-amber-500/25 flex justify-center items-center"
            >
              {loading ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                "Subscribe Now"
              )}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
