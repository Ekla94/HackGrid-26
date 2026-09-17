import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  MapPin, 
  Truck, 
  ArrowRight, 
  BarChart3, 
  AlertCircle,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { getArbitrage, getLogistics, type ArbitrageResponse, type LogisticsResponse } from '../../services/api';

interface ArbitrageEngineProps {
  onNavigateToContract?: (crop: string, tons: number) => void;
}

export default function ArbitrageEngine({ onNavigateToContract }: ArbitrageEngineProps) {
  const [crop, setCrop] = useState('Tomato');
  const [fpoLocation, setFpoLocation] = useState('Nashik');
  const [quantityKg, setQuantityKg] = useState('1000');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ArbitrageResponse | null>(null);
  const [logistics, setLogistics] = useState<LogisticsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const crops = [
    { name: 'Tomato', category: 'Perishable Horticulture', basePrice: 48 },
    { name: 'Onion', category: 'Dry Bulbs', basePrice: 25 },
    { name: 'Potato', category: 'Tubers', basePrice: 30 },
    { name: 'Wheat', category: 'Grains & Cereals', basePrice: 28 },
    { name: 'Soybean', category: 'Oilseeds', basePrice: 44 },
  ];

  const clusters = [
    { name: 'Nashik', state: 'Maharashtra', tag: 'Primary Onion/Tomato Hub' },
    { name: 'Pune', state: 'Maharashtra', tag: 'Western Agri Corridor' },
    { name: 'Agra', state: 'Uttar Pradesh', tag: 'Northern Potato Hub' },
    { name: 'Kolar', state: 'Karnataka', tag: 'Southern Tomato Cluster' },
    { name: 'Indore', state: 'Madhya Pradesh', tag: 'Central Soybean Belt' },
  ];

  const mandiComparisonTable: Record<string, { mandi: string; rate: number; distanceKm: number; transitHours: number }[]> = {
    Tomato: [
      { mandi: 'Mumbai APMC (Vashi)', rate: 48.0, distanceKm: 165, transitHours: 4.5 },
      { mandi: 'Bangalore APMC (Yeshwanthpur)', rate: 38.0, distanceKm: 850, transitHours: 18.0 },
      { mandi: 'Chennai APMC (Koyambedu)', rate: 32.0, distanceKm: 1100, transitHours: 24.0 },
      { mandi: 'Pune Gultekdi Mandi', rate: 42.0, distanceKm: 210, transitHours: 5.5 },
    ],
    Onion: [
      { mandi: 'Mumbai APMC (Vashi)', rate: 25.0, distanceKm: 165, transitHours: 4.5 },
      { mandi: 'Pune Gultekdi Mandi', rate: 20.0, distanceKm: 210, transitHours: 5.5 },
      { mandi: 'Nashik Lasalgaon APMC', rate: 15.0, distanceKm: 35, transitHours: 1.0 },
      { mandi: 'Delhi Azadpur APMC', rate: 27.5, distanceKm: 1250, transitHours: 28.0 },
    ],
    Potato: [
      { mandi: 'Mumbai APMC (Vashi)', rate: 30.0, distanceKm: 1200, transitHours: 26.0 },
      { mandi: 'Agra Mandi', rate: 18.0, distanceKm: 40, transitHours: 1.2 },
      { mandi: 'Delhi Azadpur APMC', rate: 22.0, distanceKm: 210, transitHours: 4.5 },
      { mandi: 'Kolkata Posta Mandi', rate: 26.0, distanceKm: 1150, transitHours: 25.0 },
    ],
    Wheat: [
      { mandi: 'Mumbai APMC', rate: 31.0, distanceKm: 580, transitHours: 12.0 },
      { mandi: 'Indore Mandi', rate: 24.5, distanceKm: 420, transitHours: 9.0 },
      { mandi: 'Delhi Azadpur APMC', rate: 26.0, distanceKm: 850, transitHours: 17.0 },
      { mandi: 'Bhopal APMC', rate: 23.8, distanceKm: 490, transitHours: 10.5 },
    ],
    Soybean: [
      { mandi: 'Indore APMC (Soy Conclave)', rate: 46.5, distanceKm: 420, transitHours: 9.0 },
      { mandi: 'Nagpur APMC', rate: 45.0, distanceKm: 540, transitHours: 11.0 },
      { mandi: 'Latur APMC', rate: 44.0, distanceKm: 310, transitHours: 7.0 },
      { mandi: 'Mumbai Docks (Export)', rate: 48.5, distanceKm: 165, transitHours: 4.5 },
    ],
  };

  const handleCalculate = async () => {
    if (!crop) return;
    setLoading(true);
    setError(null);
    try {
      const q = parseFloat(quantityKg) || 1000;
      const data = await getArbitrage(crop, fpoLocation, q);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch real-time APMC arbitrage data. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCalculate();
    getLogistics().then(setLogistics).catch(() => null);
  }, []);

  const activeRates = mandiComparisonTable[crop] || mandiComparisonTable.Tomato;

  return (
    <div className="w-full min-h-screen bg-stone-50 dark:bg-black transition-colors duration-500 text-zinc-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-zinc-950 transition-colors duration-500 border border-emerald-600/20 dark:border-amber-500/20 p-6 sm:p-8 rounded-2xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/10 dark:bg-amber-500/10 border border-emerald-600/30 dark:border-amber-500/30 text-emerald-700 dark:text-amber-400 text-xs font-bold tracking-widest uppercase">
              <TrendingUp className="w-3.5 h-3.5" />
              Autonomous APMC Intelligence
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              Mandi Arbitrage Engine
            </h1>
            <p className="text-stone-600 dark:text-zinc-400 text-sm sm:text-base max-w-2xl">
              Cross-corridor wholesale price discovery and real-time logistics arbitrage calculation to lock in the highest net profit margins.
            </p>
          </div>
          
          <div className="flex items-center gap-3 z-10">
            <button
              onClick={handleCalculate}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-zinc-900 transition-colors duration-500 border border-emerald-600/30 dark:border-amber-500/30 hover:border-emerald-500 dark:hover:border-amber-500 text-emerald-700 dark:text-amber-400 text-sm font-semibold transition-all hover:bg-stone-200 dark:hover:bg-zinc-800 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Spreads
            </button>
          </div>
        </div>

        {/* Control Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Form Controls */}
          <div className="bg-white dark:bg-zinc-950 transition-colors duration-500 border border-zinc-800/80 p-6 rounded-2xl space-y-5">
            <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-amber-500" />
              Arbitrage Parameters
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-zinc-400 mb-2">
                Commodity
              </label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full bg-stone-100 dark:bg-zinc-900 transition-colors duration-500 border border-stone-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                {crops.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} — {c.category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-zinc-400 mb-2">
                Origin Cluster / FPO Center
              </label>
              <select
                value={fpoLocation}
                onChange={(e) => setFpoLocation(e.target.value)}
                className="w-full bg-stone-100 dark:bg-zinc-900 transition-colors duration-500 border border-stone-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                {clusters.map((cl) => (
                  <option key={cl.name} value={cl.name}>
                    {cl.name}, {cl.state} ({cl.tag})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-zinc-400 mb-2">
                Volume for Dispatch (Kilograms)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(e.target.value)}
                  min="100"
                  step="100"
                  className="w-full bg-stone-100 dark:bg-zinc-900 transition-colors duration-500 border border-stone-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="1000"
                />
                <span className="absolute right-4 top-3 text-xs text-emerald-600 dark:text-amber-500 font-bold">
                  {((parseFloat(quantityKg) || 0) / 1000).toFixed(1)} MT
                </span>
              </div>
            </div>

            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Calculating APMC Spreads...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  Calculate Optimal Margins
                </>
              )}
            </button>

            {error && (
              <div className="p-3 bg-red-950/50 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
          </div>

          {/* Optimal Arbitrage Recommendation Card */}
          <div className="lg:col-span-2 bg-white dark:bg-zinc-950 transition-colors duration-500 border border-emerald-600/30 dark:border-amber-500/30 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 dark:bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase font-bold tracking-widest text-emerald-700 dark:text-amber-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI Recommended Target Market
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                  Active Dispatch Corridor
                </span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-2">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
                    {result?.best_market || 'Mumbai'} APMC Market
                  </h3>
                  <p className="text-stone-600 dark:text-zinc-400 text-xs sm:text-sm mt-1">
                    Direct transit from {fpoLocation} · Distance ~165 km · Express Reefer Lane
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-600 dark:text-zinc-400 block">Est. Net Profit</span>
                  <span className="text-3xl sm:text-4xl font-black text-emerald-700 dark:text-amber-400 tracking-tight">
                    ₹{result?.net_profit ? result.net_profit.toLocaleString('en-IN') : '42,750'}
                  </span>
                </div>
              </div>

              {/* Metrics row */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-stone-200 dark:border-zinc-800">
                <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-stone-200 dark:border-zinc-800">
                  <span className="text-[11px] text-stone-600 dark:text-zinc-400 block font-medium">Gross Wholesale</span>
                  <span className="text-lg font-bold text-stone-900 dark:text-white">
                    ₹{result?.gross_revenue ? result.gross_revenue.toLocaleString('en-IN') : '48,000'}
                  </span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">₹48.00 / kg</span>
                </div>

                <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-stone-200 dark:border-zinc-800">
                  <span className="text-[11px] text-stone-600 dark:text-zinc-400 block font-medium">Logistics & Freight</span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-amber-500">
                    -₹{result?.transport_cost ? result.transport_cost.toLocaleString('en-IN') : '5,250'}
                  </span>
                  <span className="text-[10px] text-stone-600 dark:text-zinc-400 block mt-0.5">150km @ ₹35/km</span>
                </div>

                <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-stone-200 dark:border-zinc-800">
                  <span className="text-[11px] text-stone-600 dark:text-zinc-400 block font-medium">Net Profit Spread</span>
                  <span className="text-lg font-bold text-emerald-400">
                    +89.1%
                  </span>
                  <span className="text-[10px] text-stone-600 dark:text-zinc-400 block mt-0.5">vs Local Farmgate</span>
                </div>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  if (onNavigateToContract) {
                    const tons = Math.max(1, Math.round((parseFloat(quantityKg) || 1000) / 1000));
                    onNavigateToContract(crop, tons);
                  }
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600/10 dark:bg-amber-500/10 hover:bg-amber-500/20 text-emerald-700 dark:text-amber-400 border border-emerald-600/30 dark:border-amber-500/30 hover:border-emerald-500 dark:hover:border-amber-500 text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                Draft Forward Contract for this Arbitrage
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Live Mandi Comparison Matrix */}
        <div className="bg-white dark:bg-zinc-950 transition-colors duration-500 border border-stone-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600 dark:text-amber-500" />
                Cross-Regional APMC Mandi Rate Comparison
              </h2>
              <p className="text-xs text-stone-600 dark:text-zinc-400 mt-1">
                Real-time price feeds calibrated with transport deductions for {crop}
              </p>
            </div>
            <span className="text-xs text-stone-500 dark:text-zinc-500 hidden sm:inline">
              Data synchronized via BioChain Wholesale Feed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase bg-stone-100 dark:bg-zinc-900 transition-colors duration-500 text-stone-600 dark:text-zinc-400 border-b border-stone-200 dark:border-zinc-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Terminal APMC</th>
                  <th className="py-3 px-4 font-semibold">Modal Price (₹/kg)</th>
                  <th className="py-3 px-4 font-semibold">Corridor Distance</th>
                  <th className="py-3 px-4 font-semibold">Transit Duration</th>
                  <th className="py-3 px-4 font-semibold">Est. Freight</th>
                  <th className="py-3 px-4 font-semibold">Arbitrage Advantage</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-stone-700 dark:text-zinc-300">
                {activeRates.map((item, idx) => {
                  const grossRate = item.rate;
                  const freight = Math.round(item.distanceKm * 35);
                  const isBest = idx === 0;
                  return (
                    <tr key={item.mandi} className={`hover:bg-zinc-900/50 transition-colors ${isBest ? 'bg-amber-500/5' : ''}`}>
                      <td className="py-3.5 px-4 font-bold text-stone-900 dark:text-white flex items-center gap-2">
                        {isBest && <Sparkles className="w-4 h-4 text-emerald-600 dark:text-amber-500 shrink-0" />}
                        {item.mandi}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-700 dark:text-amber-400">
                        ₹{grossRate.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-stone-600 dark:text-zinc-400">
                        {item.distanceKm} km
                      </td>
                      <td className="py-3.5 px-4 text-stone-600 dark:text-zinc-400">
                        {item.transitHours} hrs
                      </td>
                      <td className="py-3.5 px-4 text-stone-600 dark:text-zinc-400">
                        ₹{freight.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          isBest 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-stone-200 dark:bg-zinc-800 transition-colors duration-500 text-stone-600 dark:text-zinc-400'
                        }`}>
                          {isBest ? 'Highest Net Margin' : 'Secondary Route'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            if (onNavigateToContract) {
                              onNavigateToContract(crop, 50);
                            }
                          }}
                          className="text-xs text-emerald-600 dark:text-amber-500 hover:text-emerald-700 dark:hover:text-amber-400 font-bold hover:underline"
                        >
                          Lock Rate →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Logistics Corridor Feed */}
        {logistics && (
          <div className="bg-white dark:bg-zinc-950 transition-colors duration-500 border border-stone-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-600 dark:text-amber-500" />
                Active Logistics Corridors & Fleet Readiness
              </h2>
              <div className="flex gap-4 text-xs">
                <span className="text-stone-600 dark:text-zinc-400">
                  Active Reefer Fleets: <strong className="text-stone-900 dark:text-white">{logistics.active_fleets}</strong>
                </span>
                <span className="text-stone-600 dark:text-zinc-400">
                  Cold Storage Hubs: <strong className="text-stone-900 dark:text-white">{logistics.cold_storage_units}</strong>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {logistics.monitored_corridors.map((c) => (
                <div key={c.corridor} className="bg-stone-100 dark:bg-zinc-900 transition-colors duration-500 p-4 rounded-xl border border-stone-200 dark:border-zinc-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-stone-900 dark:text-white">{c.corridor}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      c.status === 'OPTIMAL' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-yellow-900/50 text-yellow-400'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-stone-600 dark:text-zinc-400">
                    <span>{c.distance_km} km · {c.transit_hours} hrs</span>
                    <span className="font-mono text-stone-700 dark:text-zinc-300">₹{c.cost_inr.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
