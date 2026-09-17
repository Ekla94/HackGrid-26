import { ArrowRight, Shield, TrendingUp, Globe, Leaf } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: 'registration' | 'dashboard' | 'portal' | 'arbitrage' | 'contracts') => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-black font-sans w-full text-zinc-200">
      {/* Hero Section */}
      <section className="relative bg-zinc-950 text-white overflow-hidden py-24 sm:py-32 flex-1 border-b border-amber-500/20">
        <div className="absolute inset-0 overflow-hidden">
           <div className="absolute inset-0 bg-black opacity-60"></div>
           {/* Abstract gold shapes */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob"></div>
           <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-6">
            Autonomous Agri-Brokerage & BioChain Exchange
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-white">
            Transforming Agriculture with <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600">BioChain Trust</span>
          </h1>
          <p className="mt-4 sm:mt-6 text-lg sm:text-2xl text-zinc-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Direct institutional commodity trading, AI forward smart contracts, cross-mandi arbitrage, and multi-spectral satellite proof on an immutable blockchain ledger.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => onNavigate('portal')}
              className="px-7 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] flex items-center justify-center gap-2.5 text-base transform hover:scale-105 hover:-translate-y-1 cursor-pointer"
            >
              Open Trading Desk <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onNavigate('arbitrage')}
              className="px-7 py-3.5 bg-zinc-900 border border-amber-500/50 hover:bg-zinc-800 text-amber-400 font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2 text-base transform hover:scale-105 hover:-translate-y-1 cursor-pointer"
            >
              Mandi Arbitrage Engine
            </button>
            <button 
              onClick={() => onNavigate('contracts')}
              className="px-7 py-3.5 bg-zinc-900 border border-zinc-700 hover:border-amber-500 text-zinc-200 font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2 text-base transform hover:scale-105 hover:-translate-y-1 cursor-pointer"
            >
              AI Contract Studio
            </button>
            <button 
              onClick={() => onNavigate('dashboard')}
              className="px-7 py-3.5 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white font-semibold rounded-full transition-all duration-300 flex items-center justify-center text-base transform hover:scale-105 hover:-translate-y-1 cursor-pointer"
            >
              Verification Hub
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-black" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-white tracking-tight">Why Choose KhetiNex?</h2>
            <p className="mt-4 text-xl text-zinc-400 max-w-2xl mx-auto">Our 5-Layer Verification ensures trust from farm to fork, empowering farmers and guaranteeing quality for buyers.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-8 bg-zinc-950 rounded-3xl border border-zinc-800 shadow-sm hover:border-amber-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]">
              <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Satellite & NDVI Sync</h3>
              <p className="text-zinc-400 text-lg leading-relaxed">Continuous monitoring of crop health through multi-spectral satellite imagery to guarantee biomass volume and health directly from space.</p>
            </div>
            
            <div className="p-8 bg-zinc-950 rounded-3xl border border-zinc-800 shadow-sm hover:border-amber-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]">
              <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Immutable Blockchain</h3>
              <p className="text-zinc-400 text-lg leading-relaxed">Every verification step is hashed on our BioChain, providing an unalterable audit trail for premium buyers and preventing fraud.</p>
            </div>

            <div className="p-8 bg-zinc-950 rounded-3xl border border-zinc-800 shadow-sm hover:border-amber-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]">
              <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI-Driven Arbitrage</h3>
              <p className="text-zinc-400 text-lg leading-relaxed">Our autonomous Copilot dynamically identifies the most profitable markets and buyers for your specific verified crop profile.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-zinc-950 py-20 border-t border-b border-zinc-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to maximize your yield value?</h2>
          <p className="text-xl text-zinc-400 mb-10">Join thousands of verified farmers on the BioChain network.</p>
          <button 
            onClick={() => onNavigate('registration')}
            className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] text-lg"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-zinc-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center">
            <Leaf className="w-8 h-8 text-amber-500 mr-3" />
            <span className="font-bold text-2xl tracking-wide text-white">KhetiNex</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-amber-500 transition-colors">Platform</a>
            <a href="#" className="hover:text-amber-500 transition-colors">Technology</a>
            <a href="#" className="hover:text-amber-500 transition-colors">About Us</a>
            <a href="#" className="hover:text-amber-500 transition-colors">Contact</a>
          </div>
          <div className="text-sm">
            &copy; {new Date().getFullYear()} KhetiNex. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
