import { useState } from 'react';
import BioChainDashboard from './components/BioChainDashboard';
import FarmerRegistration from './components/FarmerRegistration';
import LandingPage from './components/LandingPage';
import { Leaf } from 'lucide-react';

function App() {
  const [view, setView] = useState<'home' | 'registration' | 'dashboard'>('home');
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col w-full bg-black">
      {/* Website Navigation Header */}
      <header className="bg-zinc-950 sticky top-0 z-40 w-full shadow-sm border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div 
              className="flex items-center cursor-pointer group"
              onClick={() => setView('home')}
            >
              <div className="bg-amber-500/10 p-2 rounded-lg mr-3 group-hover:bg-amber-500/20 transition-colors border border-amber-500/20">
                <Leaf className="w-6 h-6 text-amber-500" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                KhetiNex
              </span>
            </div>
            
            <nav className="hidden md:flex gap-8">
              <button 
                onClick={() => setView('home')}
                className={`text-sm font-semibold transition-colors hover:text-amber-400 ${view === 'home' ? 'text-amber-500' : 'text-zinc-400'}`}
              >
                Home
              </button>
              <button 
                onClick={() => setView('registration')}
                className={`text-sm font-semibold transition-colors hover:text-amber-400 ${view === 'registration' ? 'text-amber-500' : 'text-zinc-400'}`}
              >
                Registration
              </button>
              <button 
                onClick={() => setView('dashboard')}
                className={`text-sm font-semibold transition-colors hover:text-amber-400 ${view === 'dashboard' ? 'text-amber-500' : 'text-zinc-400'}`}
              >
                Verification Hub
              </button>
            </nav>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsCopilotOpen(true)}
                className="hidden md:flex items-center gap-2 text-sm font-bold text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 px-4 py-2 rounded-full transition-colors border border-amber-500/30"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                AI Copilot
              </button>
              <button 
                onClick={() => setView('registration')}
                className="text-sm font-bold bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black px-6 py-2.5 rounded-full transition-shadow shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)]"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex w-full">
        {view === 'home' && <LandingPage onNavigate={setView} />}
        {view === 'registration' && <FarmerRegistration />}
        {view === 'dashboard' && <BioChainDashboard />}
      </main>

      {/* Floating Action Button (Mobile only) */}
      <button 
        onClick={() => setIsCopilotOpen(true)}
        className="md:hidden fixed bottom-6 right-6 bg-gradient-to-r from-amber-500 to-yellow-600 text-black rounded-full p-4 shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center justify-center transition-transform hover:scale-110 z-50 group"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
      </button>

      {/* Copilot Modal Overlay */}
      {isCopilotOpen && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-2 sm:p-6 backdrop-blur-md transition-opacity">
          <div className="bg-zinc-950 rounded-2xl w-full max-w-7xl h-[95vh] sm:h-[90vh] flex flex-col shadow-[0_0_50px_rgba(245,158,11,0.15)] overflow-hidden relative border-0 sm:border border-amber-500/30">
            <div className="bg-black text-white p-3 flex justify-between items-center shrink-0 border-b border-amber-500/20">
              <h3 className="font-bold flex items-center text-amber-500">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                KhetiNex Autonomous Copilot
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
