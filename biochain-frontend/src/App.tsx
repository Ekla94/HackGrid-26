import { useState } from 'react';
import BioChainDashboard from './components/BioChainDashboard';
import FarmerRegistration from './components/FarmerRegistration';
import LandingPage from './components/LandingPage';
import TradingPortal from './components/trading/TradingPortal';
import ArbitrageEngine from './components/arbitrage/ArbitrageEngine';
import ContractStudio from './components/contracts/ContractStudio';
import { 
  Leaf, 
  Store, 
  TrendingUp, 
  FileText, 
  ShieldCheck, 
  UserCheck, 
  Menu, 
  X, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export type AppView = 'home' | 'portal' | 'arbitrage' | 'contracts' | 'dashboard' | 'registration';

function App() {
  const [view, setView] = useState<AppView>('home');
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contractParams, setContractParams] = useState<{ crop: string; tons: number }>({
    crop: 'Soybean',
    tons: 50,
  });

  const handleNavigateToContract = (crop: string, tons: number) => {
    setContractParams({ crop, tons });
    setView('contracts');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Leaf },
    { id: 'portal', label: 'Trading Desk', icon: Store, badge: 'Exchange' },
    { id: 'arbitrage', label: 'Mandi Arbitrage', icon: TrendingUp, badge: 'Live' },
    { id: 'contracts', label: 'Contract Studio', icon: FileText },
    { id: 'dashboard', label: 'Verification Hub', icon: ShieldCheck },
    { id: 'registration', label: 'Farmer Onboarding', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen flex flex-col w-full bg-black text-zinc-100 font-sans">
      {/* Website Navigation Header */}
      <header className="bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40 w-full shadow-lg border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Brand Logo */}
            <div 
              className="flex items-center cursor-pointer group"
              onClick={() => { setView('home'); setMobileMenuOpen(false); }}
            >
              <div className="bg-amber-500/10 p-2.5 rounded-xl mr-3 group-hover:bg-amber-500/20 transition-all border border-amber-500/30 group-hover:border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                <Leaf className="w-6 h-6 text-amber-500 transition-transform group-hover:scale-105" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  KhetiNex
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500/80 -mt-1">
                  BioChain Exchange
                </span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-6">
              {navItems.map((item) => {
                const isActive = view === item.id;
                return (
                  <button 
                    key={item.id}
                    onClick={() => setView(item.id as AppView)}
                    className={`relative text-xs uppercase tracking-wider font-bold transition-all px-3 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer ${
                      isActive 
                        ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]' 
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    {item.label}
                    {item.badge && (
                      <span className="ml-1 text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
            
            {/* Header Right Actions */}
            <div className="hidden sm:flex items-center gap-3">
              <button 
                onClick={() => setIsCopilotOpen(true)}
                className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-4 py-2.5 rounded-full transition-all border border-amber-500/40 hover:border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)] cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                AI Copilot
              </button>
              
              <button 
                onClick={() => setView('portal')}
                className="text-xs uppercase tracking-wider font-extrabold bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black px-5 py-2.5 rounded-full transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] cursor-pointer flex items-center gap-1.5"
              >
                Trading Desk
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex xl:hidden items-center gap-2">
              <button 
                onClick={() => setIsCopilotOpen(true)}
                className="sm:hidden p-2 text-amber-400 bg-amber-500/10 rounded-lg border border-amber-500/30"
                aria-label="Open Copilot"
              >
                <Sparkles className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 border border-zinc-800"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-zinc-950 border-b border-amber-500/20 px-4 pt-2 pb-6 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id as AppView);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between cursor-pointer ${
                  view === item.id 
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' 
                    : 'text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-amber-500" />
                  {item.label}
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </header>
      
      {/* Main Content Router */}
      <main className="flex-1 flex flex-col w-full">
        {view === 'home' && (
          <LandingPage onNavigate={(v) => {
            setView(v as AppView);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} />
        )}
        {view === 'portal' && <TradingPortal />}
        {view === 'arbitrage' && <ArbitrageEngine onNavigateToContract={handleNavigateToContract} />}
        {view === 'contracts' && (
          <ContractStudio 
            initialCrop={contractParams.crop} 
            initialTons={contractParams.tons} 
          />
        )}
        {view === 'dashboard' && <BioChainDashboard />}
        {view === 'registration' && <FarmerRegistration />}
      </main>

      {/* Floating Copilot Button (Mobile only) */}
      <button 
        onClick={() => setIsCopilotOpen(true)}
        className="sm:hidden fixed bottom-6 right-6 bg-gradient-to-r from-amber-500 to-yellow-600 text-black rounded-full p-4 shadow-[0_0_25px_rgba(245,158,11,0.5)] flex items-center justify-center transition-transform hover:scale-110 z-50 cursor-pointer"
        aria-label="Open AI Copilot"
      >
        <Sparkles className="w-6 h-6" />
      </button>

      {/* Copilot Modal Drawer */}
      {isCopilotOpen && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-2 sm:p-6 backdrop-blur-md transition-opacity">
          <div className="bg-zinc-950 rounded-2xl w-full max-w-7xl h-[95vh] sm:h-[90vh] flex flex-col shadow-[0_0_50px_rgba(245,158,11,0.25)] overflow-hidden relative border border-amber-500/30">
            <div className="bg-black text-white px-4 py-3 flex justify-between items-center shrink-0 border-b border-amber-500/20">
              <h3 className="font-bold flex items-center text-amber-500 gap-2 text-sm sm:text-base">
                <Sparkles className="w-4 h-4 text-amber-500" />
                KhetiNex Autonomous Agri-Broker Copilot
              </h3>
              <button 
                onClick={() => setIsCopilotOpen(false)} 
                className="hover:text-amber-400 font-bold text-xl px-2 cursor-pointer transition-colors text-zinc-400"
                aria-label="Close Copilot"
              >
                ✕
              </button>
            </div>
            <iframe src="/copilot.html" className="flex-1 w-full h-full border-none bg-zinc-950" title="AI Copilot" />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
