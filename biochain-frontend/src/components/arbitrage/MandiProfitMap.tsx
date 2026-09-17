/// <reference types="@types/google.maps" />
// Source: Google Maps Platform Code Assist
// KhetiNex Autonomous Agri-Brokerage - Google Maps Marketplace Position Optimizer
import { useState, useEffect, useMemo } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  TrendingUp,
  MapPin,
  Navigation,
  Sparkles,
  Truck,
  KeyRound,
  ExternalLink,
  CheckCircle2,
  Compass,
} from 'lucide-react';

export interface MandiRouteData {
  mandi: string;
  rate: number;
  distanceKm: number;
  transitHours: number;
  lat: number;
  lng: number;
  state?: string;
}

export interface FpoClusterCoord {
  name: string;
  state: string;
  lat: number;
  lng: number;
}

// Geographic cluster coordinates for farmer FPOs
export const FPO_COORDINATES: Record<string, FpoClusterCoord> = {
  Nashik: { name: 'Nashik FPO Hub', state: 'Maharashtra', lat: 19.9975, lng: 73.7898 },
  Pune: { name: 'Pune Western Agri Cluster', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  Agra: { name: 'Agra Potato Collective', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081 },
  Kolar: { name: 'Kolar Tomato Fed', state: 'Karnataka', lat: 13.1362, lng: 78.1291 },
  Indore: { name: 'Indore Malwa Soybean Union', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
  Nagpur: { name: 'Nagpur Vidarbha Agro Hub', state: 'Maharashtra', lat: 21.1458, lng: 79.0882 },
  Latur: { name: 'Latur Marathwada Pulse Center', state: 'Maharashtra', lat: 18.4088, lng: 76.5604 },
  Bhopal: { name: 'Bhopal Central Grain Mandi', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
};

// Precise APMC Market coordinates across India
export const APMC_COORDINATES: Record<string, { lat: number; lng: number; state: string }> = {
  'Mumbai APMC (Vashi)': { lat: 19.0771, lng: 73.0039, state: 'Maharashtra' },
  'Mumbai APMC': { lat: 19.0771, lng: 73.0039, state: 'Maharashtra' },
  'Mumbai Docks (Export)': { lat: 18.9500, lng: 72.8500, state: 'Maharashtra' },
  'Bangalore APMC (Yeshwanthpur)': { lat: 13.0280, lng: 77.5404, state: 'Karnataka' },
  'Chennai APMC (Koyambedu)': { lat: 13.0694, lng: 80.1948, state: 'Tamil Nadu' },
  'Pune Gultekdi Mandi': { lat: 18.4965, lng: 73.8643, state: 'Maharashtra' },
  'Delhi Azadpur APMC': { lat: 28.7159, lng: 77.1783, state: 'Delhi' },
  'Nashik Lasalgaon APMC': { lat: 20.1472, lng: 74.2281, state: 'Maharashtra' },
  'Agra Mandi': { lat: 27.1600, lng: 78.0200, state: 'Uttar Pradesh' },
  'Kolkata Posta Mandi': { lat: 22.5855, lng: 88.3570, state: 'West Bengal' },
  'Indore Mandi': { lat: 22.7533, lng: 75.8937, state: 'Madhya Pradesh' },
  'Indore APMC (Soy Conclave)': { lat: 22.7533, lng: 75.8937, state: 'Madhya Pradesh' },
  'Bhopal APMC': { lat: 23.2500, lng: 77.4500, state: 'Madhya Pradesh' },
  'Nagpur APMC': { lat: 21.1738, lng: 79.1384, state: 'Maharashtra' },
  'Latur APMC': { lat: 18.4011, lng: 76.5789, state: 'Maharashtra' },
};

interface MandiProfitMapProps {
  crop: string;
  originCluster: string;
  quantityKg: number;
  mandis: { mandi: string; rate: number; distanceKm: number; transitHours: number }[];
  onLockContract?: (crop: string, tons: number) => void;
}

// Component to programmatically draw transit corridor polylines
function RoutePolylines({
  origin,
  routes,
  bestMandiName,
}: {
  origin: { lat: number; lng: number };
  routes: (MandiRouteData & { netProfit: number })[];
  bestMandiName: string;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps) return;

    const lines: google.maps.Polyline[] = [];

    routes.forEach((route) => {
      const isBest = route.mandi === bestMandiName;
      const poly = new google.maps.Polyline({
        path: [origin, { lat: route.lat, lng: route.lng }],
        geodesic: true,
        strokeColor: isBest ? '#f59e0b' : '#64748b',
        strokeOpacity: isBest ? 0.95 : 0.45,
        strokeWeight: isBest ? 4.5 : 2,
        zIndex: isBest ? 10 : 2,
        icons: isBest
          ? [
              {
                icon: {
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  scale: 3.5,
                  strokeColor: '#f59e0b',
                  fillColor: '#f59e0b',
                  fillOpacity: 1,
                },
                offset: '60%',
              },
            ]
          : undefined,
      });

      poly.setMap(map);
      lines.push(poly);
    });

    return () => {
      lines.forEach((l) => l.setMap(null));
    };
  }, [map, origin, routes, bestMandiName]);

  return null;
}

// Camera pan controller
function MapCameraHandler({
  center,
  zoom,
}: {
  center: { lat: number; lng: number };
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    map.panTo(center);
    map.setZoom(zoom);
  }, [map, center, zoom]);
  return null;
}

export default function MandiProfitMap({
  crop,
  originCluster,
  quantityKg,
  mandis,
  onLockContract,
}: MandiProfitMapProps) {
  // Read API Key from environment or local storage
  const [apiKey, setApiKey] = useState<string>(() => {
    return (
      localStorage.getItem('khetinex_gmaps_key') ||
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
      ''
    );
  });
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const [selectedMandi, setSelectedMandi] = useState<string | null>(null);

  // Derive origin coordinates
  const origin = useMemo<FpoClusterCoord>(() => {
    return (
      FPO_COORDINATES[originCluster] || {
        name: `${originCluster} FPO Hub`,
        state: 'India',
        lat: 20.0,
        lng: 74.0,
      }
    );
  }, [originCluster]);

  // Compute detailed profit calculations for each mandi
  const computedRoutes = useMemo(() => {
    const freightRatePerKm = 35; // standard truck freight in INR per km
    const mandiCessPercent = 0.015; // 1.5% APMC market cess

    const list = mandis.map((m) => {
      const coords = APMC_COORDINATES[m.mandi] || {
        lat: origin.lat + (m.distanceKm / 111) * 0.7,
        lng: origin.lng + (m.distanceKm / 111) * 0.7,
        state: 'Terminal',
      };

      const grossRevenue = quantityKg * m.rate;
      const freightCost = Math.round(m.distanceKm * freightRatePerKm);
      const cessCost = Math.round(grossRevenue * mandiCessPercent);
      const netProfit = grossRevenue - freightCost - cessCost;

      return {
        ...m,
        lat: coords.lat,
        lng: coords.lng,
        state: coords.state,
        grossRevenue,
        freightCost,
        cessCost,
        netProfit,
        profitMarginPct: ((netProfit / (grossRevenue || 1)) * 100).toFixed(1),
      };
    });

    // Sort descending by net profit to identify the BEST marketplace position
    return list.sort((a, b) => b.netProfit - a.netProfit);
  }, [mandis, quantityKg, origin]);

  const bestMarketplace = computedRoutes[0] ?? null;

  // Selected mandi detail object
  const activeDetail = useMemo(() => {
    if (!selectedMandi) return bestMarketplace;
    return computedRoutes.find((r) => r.mandi === selectedMandi) || bestMarketplace;
  }, [selectedMandi, computedRoutes, bestMarketplace]);

  const handleSaveKey = (keyVal: string) => {
    const clean = keyVal.trim();
    setApiKey(clean);
    localStorage.setItem('khetinex_gmaps_key', clean);
    setShowKeyModal(false);
  };

  return (
    <div className="bg-white dark:bg-zinc-950 transition-colors duration-500 border border-emerald-600/30 dark:border-amber-500/30 rounded-2xl p-4 sm:p-6 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10 border-b border-stone-200 dark:border-zinc-800/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/10 dark:bg-amber-500/10 border border-emerald-600/30 dark:border-amber-500/30 text-emerald-700 dark:text-amber-400 text-xs font-bold tracking-widest uppercase">
            <Compass className="w-3.5 h-3.5" />
            Google Maps Platform Integration
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight mt-1 flex items-center gap-2.5">
            <span>Optimal Marketplace Position</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400">
              Highest Farmer Profit
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-zinc-400 mt-1">
            Analyzing live transport corridors from <strong>{origin.name}</strong> to discover the most profitable terminal APMC mandi.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowKeyModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 dark:bg-zinc-900 border border-stone-300 dark:border-zinc-700 hover:border-amber-500 text-xs font-bold text-stone-700 dark:text-zinc-300 transition-colors cursor-pointer"
            title="Configure Google Maps API Key or Demo Key"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-500" />
            <span>{apiKey ? 'API Key Configured' : 'Set Google Maps Key'}</span>
          </button>
        </div>
      </div>

      {/* Key Input Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/80 z-[120] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-500" />
                Google Maps API Configuration
              </h3>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-zinc-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-zinc-400">
              Enter your Google Maps Platform API Key. For zero-cost prototyping without a credit card, you can mint a free <strong>Maps Demo Key</strong> from Google.
            </p>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Google Maps API Key
              </label>
              <input
                type="text"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex items-center justify-between text-xs pt-2">
              <a
                href="https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_git_agentskills_v1"
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:underline flex items-center gap-1"
              >
                Get Free Maps Demo Key <ExternalLink className="w-3 h-3" />
              </a>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveKey(tempKey)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors"
                >
                  Save Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map + Decision Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Main Map Container (2 Columns) */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-stone-300 dark:border-zinc-800 bg-stone-100 dark:bg-zinc-900 relative min-h-[480px] h-[520px] shadow-inner">
          {apiKey ? (
            <APIProvider apiKey={apiKey} libraries={['places', 'routes', 'geometry']}>
              <Map
                mapId="DEMO_MAP_ID"
                internalUsageAttributionIds={['gmp_git_agentskills_v1']}
                style={{ width: '100%', height: '100%' }}
                defaultCenter={{ lat: origin.lat, lng: origin.lng }}
                defaultZoom={6}
                gestureHandling="greedy"
                disableDefaultUI={false}
              >
                <MapCameraHandler center={{ lat: origin.lat, lng: origin.lng }} zoom={6} />

                {/* Polylines to all mandis */}
                <RoutePolylines
                  origin={{ lat: origin.lat, lng: origin.lng }}
                  routes={computedRoutes}
                  bestMandiName={bestMarketplace?.mandi || ''}
                />

                {/* Farmer Origin Hub Marker */}
                <AdvancedMarker
                  position={{ lat: origin.lat, lng: origin.lng }}
                  title={origin.name}
                >
                  <div className="flex flex-col items-center cursor-pointer group">
                    <div className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black tracking-wider uppercase shadow-md mb-1 whitespace-nowrap border border-white/20">
                      Origin Farmgate
                    </div>
                    <Pin
                      background="#059669"
                      glyphColor="#ffffff"
                      borderColor="#064e3b"
                      scale={1.2}
                    />
                  </div>
                </AdvancedMarker>

                {/* Candidate APMC Mandi Markers */}
                {computedRoutes.map((item) => {
                  const isBest = item.mandi === bestMarketplace?.mandi;
                  return (
                    <AdvancedMarker
                      key={item.mandi}
                      position={{ lat: item.lat, lng: item.lng }}
                      onClick={() => setSelectedMandi(item.mandi)}
                      title={item.mandi}
                    >
                      <div className="flex flex-col items-center cursor-pointer transition-transform hover:scale-110">
                        {isBest ? (
                          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-black text-[10px] font-black tracking-wide uppercase shadow-[0_0_15px_rgba(245,158,11,0.6)] mb-1 whitespace-nowrap animate-bounce">
                            <Sparkles className="w-3 h-3" /> BEST PROFIT: ₹{item.netProfit.toLocaleString('en-IN')}
                          </div>
                        ) : (
                          <div className="px-2 py-0.5 rounded-md bg-zinc-900/90 text-zinc-300 text-[9px] font-bold border border-zinc-700 mb-1 whitespace-nowrap">
                            ₹{item.rate}/kg
                          </div>
                        )}
                        <Pin
                          background={isBest ? '#f59e0b' : '#334155'}
                          glyphColor={isBest ? '#000000' : '#ffffff'}
                          borderColor={isBest ? '#b45309' : '#1e293b'}
                          scale={isBest ? 1.35 : 1.0}
                        />
                      </div>
                    </AdvancedMarker>
                  );
                })}

                {/* Selected InfoWindow */}
                {selectedMandi && activeDetail && (
                  <InfoWindow
                    position={{ lat: activeDetail.lat, lng: activeDetail.lng }}
                    onCloseClick={() => setSelectedMandi(null)}
                  >
                    <div className="p-2 text-zinc-900 max-w-xs space-y-1.5 font-sans">
                      <div className="font-extrabold text-sm text-zinc-900 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-amber-600" />
                        {activeDetail.mandi}
                      </div>
                      <div className="text-xs text-zinc-600 font-medium">
                        Modal Rate: <strong className="text-emerald-700">₹{activeDetail.rate.toFixed(2)}/kg</strong>
                      </div>
                      <div className="text-xs text-zinc-600">
                        Highway Distance: <strong>{activeDetail.distanceKm} km</strong> (~{activeDetail.transitHours} hrs)
                      </div>
                      <div className="text-xs text-zinc-600">
                        Logistics Freight: <strong>₹{activeDetail.freightCost.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="text-xs pt-1 border-t border-zinc-200 font-black text-amber-600 flex justify-between">
                        <span>Net Farmer Profit:</span>
                        <span>₹{activeDetail.netProfit.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>
          ) : (
            /* Interactive Satellite Viewport Fallback with Canvas Agri-Corridors */
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-4 relative overflow-hidden bg-gradient-to-b from-zinc-900 to-black">
              {/* Visual simulated map topology */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(245,158,11,0.2)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Central badge */}
              <div className="z-10 max-w-md space-y-3 bg-zinc-950/90 border border-amber-500/30 p-6 rounded-2xl shadow-2xl backdrop-blur-md">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-500 flex items-center justify-center mx-auto">
                  <Navigation className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-lg font-black text-white">
                  Google Maps Agri-Corridor Engine Ready
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Connect your Google Maps Platform API key or use the free <strong>Maps Demo Key</strong> to view live satellite routes, transit heatmaps, and street overlays for terminal mandis.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    onClick={() => setShowKeyModal(true)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-xs font-black uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                  >
                    Enter Google Maps Key
                  </button>
                  <a
                    href="https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_git_agentskills_v1"
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-700 text-amber-400 hover:text-white text-xs font-bold flex items-center justify-center gap-1"
                  >
                    Get Demo Key <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Dynamic Interactive Corridors Preview */}
              <div className="z-10 w-full max-w-lg grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {computedRoutes.slice(0, 4).map((r, idx) => (
                  <button
                    key={r.mandi}
                    onClick={() => setSelectedMandi(r.mandi)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      idx === 0
                        ? 'bg-amber-500/15 border-amber-500 text-amber-400'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span className="text-[10px] block truncate font-bold">{r.mandi.split(' ')[0]}</span>
                    <span className="text-xs font-black block text-white">₹{r.rate}/kg</span>
                    <span className="text-[9px] block text-emerald-400">+{r.profitMarginPct}%</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Map Overlay Badge */}
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <div className="px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-amber-500/30 text-white text-xs font-bold flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Corridor: {origin.name}</span>
            </div>
          </div>
        </div>

        {/* Selected / Optimal Position Deep-Dive Card (1 Column) */}
        <div className="flex flex-col justify-between bg-stone-100 dark:bg-zinc-900/90 transition-colors duration-500 border border-emerald-600/30 dark:border-amber-500/30 rounded-2xl p-5 space-y-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest text-amber-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {activeDetail?.mandi === bestMarketplace?.mandi ? 'Top Recommended Position' : 'Selected Marketplace'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                Rank #{computedRoutes.findIndex((r) => r.mandi === activeDetail?.mandi) + 1}
              </span>
            </div>

            <div>
              <h3 className="text-xl font-black text-stone-900 dark:text-white">
                {activeDetail?.mandi}
              </h3>
              <p className="text-xs text-stone-600 dark:text-zinc-400 mt-0.5">
                {activeDetail?.distanceKm} km from {originCluster} · ~{activeDetail?.transitHours} hrs highway transit
              </p>
            </div>

            {/* Profit Callout Card */}
            <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-amber-500/30 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-stone-500 dark:text-zinc-400">Projected Net Profit:</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-amber-400">
                  ₹{activeDetail?.netProfit.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-stone-200 dark:border-zinc-800 text-xs text-stone-600 dark:text-zinc-400">
                <div className="flex justify-between">
                  <span>Gross Value ({((quantityKg || 1000) / 1000).toFixed(1)} MT):</span>
                  <span className="font-bold text-stone-900 dark:text-white">₹{activeDetail?.grossRevenue.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transit Freight (@ ₹35/km):</span>
                  <span className="font-bold text-red-500">-₹{activeDetail?.freightCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>APMC Market Cess (1.5%):</span>
                  <span className="font-bold text-red-500">-₹{activeDetail?.cessCost.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Why This Position Wins */}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-stone-900 dark:text-white uppercase tracking-wider text-[10px]">
                Market Position Advantage
              </div>
              <div className="flex items-start gap-2 text-stone-600 dark:text-zinc-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  Wholesale modal rate of <strong>₹{activeDetail?.rate.toFixed(2)}/kg</strong> easily absorbs freight deductions.
                </span>
              </div>
              <div className="flex items-start gap-2 text-stone-600 dark:text-zinc-400">
                <Truck className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  High liquidity APMC corridor guarantees 24-hour weighbridge intake and instant escrow disbursement.
                </span>
              </div>
            </div>
          </div>

          {/* Forward Contract CTA */}
          <div className="pt-2">
            <button
              onClick={() => {
                if (onLockContract) {
                  const tons = Math.max(1, Math.round((quantityKg || 1000) / 1000));
                  onLockContract(crop, tons);
                }
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Lock Arbitrage at {activeDetail?.mandi.split(' ')[0]}</span>
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
