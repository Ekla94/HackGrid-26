import { useState } from 'react';
import BioChainDashboard from './components/BioChainDashboard';
import FarmerRegistration from './components/FarmerRegistration';

function App() {
  const [view, setView] = useState<'registration' | 'dashboard'>('registration');

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
    </div>
  );
}

export default App;
