import React, { useState } from 'react';
import Arbitrage from './components/Arbitrage';
import SmartContract from './components/SmartContract';

export default function App() {
    const [activeTab, setActiveTab] = useState('arbitrage');

    return (
        <div className="w-full h-screen bg-black overflow-hidden flex justify-center items-center">
            {/* Mobile App Simulator Shell (limits width on desktop, full width on actual mobile) */}
            <div className="w-full max-w-md h-full bg-gray-50 relative flex flex-col shadow-2xl overflow-y-auto">
                
                {/* Dynamic View Rendering */}
                <div className="flex-1 overflow-y-auto pb-16">
                    {activeTab === 'arbitrage' && <Arbitrage />}
                    {activeTab === 'contract' && <SmartContract />}
                </div>

                {/* Mobile Bottom Navigation Bar */}
                <div className="absolute bottom-0 w-full bg-white border-t border-gray-200 flex justify-around items-center py-3 pb-safe z-50">
                    <button 
                        onClick={() => setActiveTab('arbitrage')}
                        className={`flex flex-col items-center space-y-1 ${activeTab === 'arbitrage' ? 'text-green-600' : 'text-gray-400'}`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                        <span className="text-[10px] font-medium">Arbitrage</span>
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('contract')}
                        className={`flex flex-col items-center space-y-1 ${activeTab === 'contract' ? 'text-blue-600' : 'text-gray-400'}`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <span className="text-[10px] font-medium">Contracts</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
