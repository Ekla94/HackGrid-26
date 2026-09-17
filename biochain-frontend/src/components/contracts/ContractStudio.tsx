import { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Download, 
  Building, 
  Users, 
  Coins, 
  Lock,
  Sparkles,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { generateContract, type ContractResponse } from '../../services/api';

interface ContractStudioProps {
  initialCrop?: string;
  initialTons?: number;
}

export default function ContractStudio({ initialCrop = 'Soybean', initialTons = 50 }: ContractStudioProps) {
  const [formData, setFormData] = useState({
    fpo: 'KisanSetu Farmer Producer Org',
    buyer: 'Maharashtra Grain Merchants Ltd',
    crop: initialCrop,
    tons: initialTons.toString(),
  });

  const [escrowAdvance, setEscrowAdvance] = useState(30);
  const [spoilageCap, setSpoilageCap] = useState(4);
  const [loading, setLoading] = useState(false);
  const [contractResult, setContractResult] = useState<ContractResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pricePerTonMap: Record<string, number> = {
    Tomato: 48000,
    Onion: 25000,
    Potato: 30000,
    Wheat: 28000,
    Soybean: 48000,
    Chilli: 120000,
  };

  const currentPricePerTon = pricePerTonMap[formData.crop] || 48000;
  const currentTons = parseFloat(formData.tons) || 0;
  const estimatedTotalValuation = currentTons * currentPricePerTon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        fpo: formData.fpo,
        buyer: formData.buyer,
        crop: formData.crop,
        tons: Math.max(1, parseInt(formData.tons, 10) || 50),
      };

      const res = await generateContract(payload);
      setContractResult(res);
    } catch (err) {
      console.error(err);
      setError('Failed to generate smart contract. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (contractResult?.contract) {
      navigator.clipboard.writeText(contractResult.contract);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full min-h-screen bg-stone-50 dark:bg-black transition-colors duration-500 text-zinc-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-zinc-950 transition-colors duration-500 border border-emerald-600/20 dark:border-amber-500/20 p-6 sm:p-8 rounded-2xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/10 dark:bg-amber-500/10 border border-emerald-600/30 dark:border-amber-500/30 text-emerald-700 dark:text-amber-400 text-xs font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Automated Legal Engine
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              AI Smart Contract Studio
            </h1>
            <p className="text-stone-600 dark:text-zinc-400 text-sm sm:text-base max-w-2xl">
              Draft cryptographic B2B agricultural forward contracts with automated escrow milestones, weighbridge release triggers, and transit spoilage indemnity.
            </p>
          </div>

          <div className="flex items-center gap-3 z-10">
            <span className="px-3.5 py-1.5 rounded-full bg-stone-100 dark:bg-zinc-900 transition-colors duration-500 border border-stone-300 dark:border-zinc-700 text-stone-700 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-amber-500" />
              Smart Contract Engine v2.0
            </span>
          </div>
        </div>

        {/* Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Configuration Form */}
          <div className="lg:col-span-5 bg-white dark:bg-zinc-950 transition-colors duration-500 border border-stone-200 dark:border-zinc-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2 border-b border-stone-200 dark:border-zinc-800 pb-3">
              <FileCheck className="w-5 h-5 text-emerald-600 dark:text-amber-500" />
              Contract Parameters
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-amber-500" />
                  Seller (Farmer Producer Org / FPO)
                </label>
                <input
                  type="text"
                  value={formData.fpo}
                  onChange={(e) => setFormData({ ...formData, fpo: e.target.value })}
                  required
                  placeholder="e.g. KisanSetu FPO"
                  className="w-full bg-stone-100 dark:bg-zinc-900 transition-colors duration-500 border border-stone-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-emerald-600 dark:text-amber-500" />
                  Corporate Buyer Entity
                </label>
                <input
                  type="text"
                  value={formData.buyer}
                  onChange={(e) => setFormData({ ...formData, buyer: e.target.value })}
                  required
                  placeholder="e.g. Maharashtra Grain Merchants Ltd"
                  className="w-full bg-stone-100 dark:bg-zinc-900 transition-colors duration-500 border border-stone-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-zinc-400 mb-1.5">
                    Commodity
                  </label>
                  <select
                    value={formData.crop}
                    onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                    className="w-full bg-stone-100 dark:bg-zinc-900 transition-colors duration-500 border border-stone-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                  >
                    <option value="Soybean">Soybean</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Onion">Onion</option>
                    <option value="Potato">Potato</option>
                    <option value="Wheat">Wheat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-zinc-400 mb-1.5">
                    Volume (Metric Tons)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.tons}
                    onChange={(e) => setFormData({ ...formData, tons: e.target.value })}
                    required
                    className="w-full bg-stone-100 dark:bg-zinc-900 transition-colors duration-500 border border-stone-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              {/* Escrow Customization */}
              <div className="bg-zinc-900/80 p-4 rounded-xl border border-stone-200 dark:border-zinc-800 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-amber-400 block flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5" />
                  Escrow Milestones & Protections
                </span>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-600 dark:text-zinc-400">Advance Escrow Lock</span>
                  <span className="font-bold text-stone-900 dark:text-white">{escrowAdvance}% (Pre-Dispatch)</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={escrowAdvance}
                  onChange={(e) => setEscrowAdvance(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />

                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-stone-600 dark:text-zinc-400">Transit Spoilage Cap</span>
                  <span className="font-bold text-stone-900 dark:text-white">{spoilageCap}% Max</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={spoilageCap}
                  onChange={(e) => setSpoilageCap(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Valuation Card */}
              <div className="bg-gradient-to-br from-amber-500/10 to-yellow-600/5 p-4 rounded-xl border border-emerald-600/30 dark:border-amber-500/30 flex justify-between items-center">
                <div>
                  <span className="text-[11px] text-amber-300 font-semibold block uppercase">Total Forward Valuation</span>
                  <span className="text-2xl font-black text-stone-900 dark:text-white">
                    ₹{estimatedTotalValuation.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="text-xs text-stone-600 dark:text-zinc-400 text-right">
                  @{currentPricePerTon.toLocaleString('en-IN')}/MT
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Drafting Smart Contract...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Generate & Sign Smart Contract
                  </>
                )}
              </button>

              {error && (
                <div className="p-3 bg-red-950/50 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}
            </form>
          </div>

          {/* Contract Preview & Certificate */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white dark:bg-zinc-950 transition-colors duration-500 border border-stone-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col h-full min-h-[500px]">
              <div className="flex justify-between items-center border-b border-stone-200 dark:border-zinc-800 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs uppercase font-bold tracking-widest text-stone-700 dark:text-zinc-300">
                    {contractResult ? `Contract #${contractResult.contract_id} · Signed` : 'Draft Terminal View'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    disabled={!contractResult}
                    className="p-2 rounded-lg bg-stone-100 dark:bg-zinc-900 transition-colors duration-500 border border-stone-300 dark:border-zinc-700 hover:border-emerald-500 dark:hover:border-amber-500 text-stone-700 dark:text-zinc-300 hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
                    title="Copy Contract"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => window.print()}
                    disabled={!contractResult}
                    className="p-2 rounded-lg bg-stone-100 dark:bg-zinc-900 transition-colors duration-500 border border-stone-300 dark:border-zinc-700 hover:border-emerald-500 dark:hover:border-amber-500 text-stone-700 dark:text-zinc-300 hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
                    title="Export / Print"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Terminal View of Contract */}
              <div className="flex-1 bg-stone-50 dark:bg-black transition-colors duration-500 rounded-xl p-5 border border-stone-200 dark:border-zinc-900 font-mono text-xs text-amber-200/90 overflow-y-auto leading-relaxed shadow-inner">
                {contractResult ? (
                  <pre className="whitespace-pre-wrap font-mono">
                    {contractResult.contract}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-600 text-center space-y-3 py-16">
                    <FileText className="w-12 h-12 text-zinc-700" />
                    <div>
                      <p className="font-semibold text-stone-600 dark:text-zinc-400 text-sm">Contract Ready for Drafting</p>
                      <p className="text-xs text-zinc-600 mt-1">
                        Fill in the parameters on the left and click "Generate & Sign Smart Contract".
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Cryptographic Seal */}
              {contractResult && (
                <div className="mt-4 pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[11px] text-stone-600 dark:text-zinc-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>BioChain Escrow Hash: <code className="text-emerald-700 dark:text-amber-400 font-mono">0x4a9b...7f21</code></span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-bold">
                    Immutable & Legally Enforceable
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
