import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import BioChainDashboard from './components/BioChainDashboard';
import FarmerRegistration from './components/FarmerRegistration';
import LandingPage from './components/LandingPage';
import TradingPortal from './components/trading/TradingPortal';
import ArbitrageEngine from './components/arbitrage/ArbitrageEngine';
import ContractStudio from './components/contracts/ContractStudio';
import { SubscriptionPortal } from './components/SubscriptionPortal';
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
  ArrowRight,
  Sun,
  Moon
} from 'lucide-react';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [contractParams, setContractParams] = useState<{ crop: string; tons: number }>({
    crop: 'Soybean',
    tons: 50,
  });

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/subscription/status?business_name=Demo Business');
      const data = await res.json();
      setIsPro(data.tier === 'pro' || data.tier === 'enterprise');
    } catch (err) {
      console.error(err);
    }
  };

  const handleNavigateToContract = (crop: string, tons: number) => {
    setContractParams({ crop, tons });
    navigate('/contracts');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Leaf },
    { path: '/trade', label: 'Trading Desk', icon: Store, badge: 'Exchange' },
    { path: '/arbitrage', label: 'Mandi Arbitrage', icon: TrendingUp, badge: 'Live' },
    { path: '/contracts', label: 'Contract Studio', icon: FileText },
    { path: '/verification', label: 'Verification Hub', icon: ShieldCheck },
    { path: '/onboarding', label: 'Farmer Onboarding', icon: UserCheck },
  ];

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen flex flex-col w-full bg-stone-50 dark:bg-black text-stone-900 dark:text-zinc-100 font-sans overflow-x-hidden transition-colors duration-500">
        {/* Website Navigation Header */}
        <header className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40 w-full shadow-lg border-b border-emerald-500/20 dark:border-amber-500/20 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Brand Logo */}
            <Link 
              to="/"
              className="flex items-center cursor-pointer group"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="bg-emerald-600/10 dark:bg-amber-500/10 p-2.5 rounded-xl mr-3 group-hover:bg-emerald-600/20 dark:group-hover:bg-amber-500/20 transition-all border border-emerald-600/30 dark:border-amber-500/30 group-hover:border-emerald-600/50 dark:group-hover:border-amber-500/50 shadow-[0_0_15px_rgba(5,150,105,0.15)] dark:shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                <Leaf className="w-6 h-6 text-emerald-600 dark:text-amber-500 transition-transform group-hover:scale-105" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-tight text-stone-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-amber-400 transition-colors">
                  KhetiNex
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700/80 dark:text-amber-500/80 -mt-1">
                  BioChain Exchange
                </span>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-2 lg:gap-3">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link 
                    key={item.path}
                    to={item.path}
                    className={`relative text-[10px] xl:text-xs uppercase tracking-wider font-bold transition-all duration-300 ease-in-out px-2 xl:px-3 py-1.5 xl:py-2 rounded-lg flex items-center gap-1.5 cursor-pointer ${
                      isActive 
                        ? 'text-emerald-700 dark:text-amber-400 bg-emerald-600/10 dark:bg-amber-500/10 border border-emerald-600/30 dark:border-amber-500/30 shadow-[0_0_10px_rgba(5,150,105,0.15)] dark:shadow-[0_0_10px_rgba(245,158,11,0.15)] scale-105' 
                        : 'text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-zinc-900/60 hover:scale-105'
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden xl:inline">{item.label}</span>
                    <span className="xl:hidden">{item.label.split(' ')[0]}</span>
                    {item.badge && (
                      <span className="ml-0.5 text-[8px] px-1 py-0.5 rounded bg-emerald-600/20 dark:bg-amber-500/20 text-emerald-700 dark:text-amber-300 border border-emerald-600/30 dark:border-amber-500/30">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
            
            {/* Header Right Actions */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-3">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white shrink-0"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {isPro ? (
                <div className="flex items-center gap-1 text-[10px] xl:text-xs uppercase font-bold text-emerald-700 dark:text-amber-500 bg-emerald-900/10 dark:bg-amber-900/20 px-3 py-1.5 rounded-full border border-emerald-500/30 dark:border-amber-500/30 transition-all duration-300 shrink-0">
                  <Crown className="w-3.5 h-3.5" /> PRO
                </div>
              ) : (
                <button 
                  onClick={() => setIsSubModalOpen(true)}
                  className="text-[10px] xl:text-xs uppercase font-bold text-white dark:text-black bg-stone-900 dark:bg-white hover:bg-stone-700 dark:hover:bg-zinc-200 px-3 py-1.5 xl:px-4 xl:py-2 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer shrink-0"
                >
                  Upgrade
                </button>
              )}

              <button 
                onClick={() => setIsCopilotOpen(true)}
                className="flex items-center gap-1.5 text-[10px] xl:text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-amber-400 bg-emerald-600/10 dark:bg-amber-500/10 hover:bg-emerald-600/20 dark:hover:bg-amber-500/20 px-3 py-1.5 xl:px-4 xl:py-2.5 rounded-full transition-all duration-300 hover:border-emerald-600 dark:hover:border-amber-400 hover:scale-105 shadow-[0_0_15px_rgba(5,150,105,0.15)] dark:shadow-[0_0_15px_rgba(245,158,11,0.15)] border border-emerald-500/40 dark:border-amber-500/40 cursor-pointer shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-amber-400" />
                Copilot
              </button>
              
              <button 
                onClick={() => navigate('/trade')}
                className="text-[10px] xl:text-xs uppercase tracking-wider font-extrabold bg-gradient-to-r from-emerald-500 to-green-600 dark:from-amber-500 dark:to-yellow-600 hover:from-emerald-400 hover:to-green-500 dark:hover:from-amber-400 dark:hover:to-yellow-500 text-white dark:text-black px-4 py-1.5 xl:px-5 xl:py-2.5 rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(5,150,105,0.3)] dark:shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(5,150,105,0.5)] dark:hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] cursor-pointer flex items-center gap-1 shrink-0"
              >
                Trade
                <ArrowRight className="w-3 h-3 xl:w-3.5 xl:h-3.5" />
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

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white dark:bg-zinc-950 border-b border-emerald-500/20 dark:border-amber-500/20 p-4 absolute top-20 left-0 w-full shadow-2xl transition-colors duration-500">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link 
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all font-bold cursor-pointer ${
                      isActive 
                        ? 'text-emerald-700 dark:text-amber-400 bg-emerald-600/10 dark:bg-amber-500/10 border border-emerald-600/30 dark:border-amber-500/30' 
                        : 'text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-zinc-900/50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                    {item.badge && (
                      <span className="ml-auto text-[10px] px-2 py-0.5 rounded bg-emerald-600/20 dark:bg-amber-500/20 text-emerald-700 dark:text-amber-300 border border-emerald-600/30 dark:border-amber-500/30">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>
      
      {/* Main Content Router */}
      <main className="flex-1 flex flex-col w-full animate-in fade-in duration-500 relative">
        <Routes>
          <Route path="/" element={<LandingPage onNavigate={(path) => { navigate(`/${path === 'portal' ? 'trade' : path === 'dashboard' ? 'verification' : path === 'registration' ? 'onboarding' : path}`); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />} />
          <Route path="/trade" element={<div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><TradingPortal /></div>} />
          <Route path="/arbitrage" element={<div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><ArbitrageEngine onNavigateToContract={handleNavigateToContract} /></div>} />
          <Route path="/contracts" element={
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ContractStudio initialCrop={contractParams.crop} initialTons={contractParams.tons} />
            </div>
          } />
          <Route path="/verification" element={<div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><BioChainDashboard /></div>} />
          <Route path="/onboarding" element={<div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><FarmerRegistration /></div>} />
        </Routes>
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

      {/* Subscription Portal UI */}
      {isSubModalOpen && (
        <SubscriptionPortal 
          onClose={() => setIsSubModalOpen(false)} 
          onSuccess={() => {
            setIsSubModalOpen(false);
            setIsPro(true);
          }} 
        />
      )}
      </div>
    </div>
  );
}

export default App;
