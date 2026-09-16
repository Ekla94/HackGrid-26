import React, { useState } from 'react';
import { getArbitrage } from '../services/api';

export default function Arbitrage() {
    const [crop, setCrop] = useState('');
    // For a hackathon, we can hardcode the FPO location or add an input later
    const [fpoLocation, setFpoLocation] = useState('Pune'); 
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleCalculate = async () => {
        if (!crop) return;
        
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await getArbitrage(crop, fpoLocation);
            setResult(data);
        } catch (err) {
            setError('Failed to fetch arbitrage data. Please ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800">Arbitrage Margins</h2>
            <p className="text-gray-500 text-sm">Compare wholesale market prices to maximize net profits.</p>
            
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Select Crop</label>
                <select 
                    value={crop} 
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
                >
                    <option value="">-- Choose a crop --</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Onion">Onion</option>
                    <option value="Potato">Potato</option>
                    <option value="Wheat">Wheat</option>
                </select>
            </div>

            <button 
                onClick={handleCalculate}
                disabled={!crop || loading}
                className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded shadow transition duration-150 disabled:opacity-50"
            >
                {loading ? 'Calculating...' : 'Calculate Margins'}
            </button>

            {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded text-sm">
                    {error}
                </div>
            )}

            {result && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center animate-fade-in">
                    <h3 className="text-sm font-semibold text-green-800 uppercase tracking-wide">Estimated Net Profit</h3>
                    {/* Assuming the backend returns something like { "profit": 15000, "market": "Mumbai APMC" } */}
                    <p className="text-3xl font-extrabold text-green-600 mt-2">
                        ₹{result.profit ? result.profit.toLocaleString() : '---'}
                    </p>
                    <p className="text-xs text-green-700 mt-2">
                        {result.details ? result.details : 'Based on real-time APMC data'}
                    </p>
                </div>
            )}
        </div>
    );
}
