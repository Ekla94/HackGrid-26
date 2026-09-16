import { useState } from 'react';
import BioChainDashboard from './components/BioChainDashboard';
import FarmerRegistration from './components/FarmerRegistration';

function App() {
  const [view, setView] = useState<'registration' | 'dashboard'>('registration');
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  return (
    <div>
      <nav className="bg-green-800 p-4 text-white flex gap-6 shadow-md relative z-10">
        <div className="font-bold text-xl mr-4 flex items-center">
          🌱 BioChain Direct
        </div>
        <button 
          onClick={() => setView('registration')}
          className={`font-semibold transition-opacity ${view === 'registration' ? 'opacity-100 border-b-2 border-white' : 'opacity-70 hover:opacity-100'}`}
        >
          1. Registration
        </button>
        <button 
          onClick={() => setView('dashboard')}
          className={`font-semibold transition-opacity ${view === 'dashboard' ? 'opacity-100 border-b-2 border-white' : 'opacity-70 hover:opacity-100'}`}
        >
          2. Verification & AI Hub
        </button>
      </nav>
      
      <main>
        {view === 'registration' ? <FarmerRegistration /> : <BioChainDashboard />}
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsCopilotOpen(true)}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-2xl flex items-center justify-center transition-transform hover:scale-110 z-50 group"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-3 transition-all duration-300 ease-in-out font-bold">
          KhetiNex AI Copilot
        </span>
      </button>

      {/* Copilot Modal Overlay */}
      {isCopilotOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-7xl h-[90vh] flex flex-col shadow-2xl overflow-hidden relative border-4 border-green-600">
            <div className="bg-green-800 text-white p-3 flex justify-between items-center">
              <h3 className="font-bold flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                KhetiNex Autonomous Copilot
              </h3>
              <button onClick={() => setIsCopilotOpen(false)} className="hover:text-red-300 font-bold text-xl px-2 cursor-pointer hover:scale-110">✕</button>
            </div>
            <iframe src="/copilot.html" className="flex-1 w-full h-full border-none" title="AI Copilot" />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
