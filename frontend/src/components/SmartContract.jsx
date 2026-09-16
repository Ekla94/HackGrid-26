import React, { useState } from 'react';
import { generateContract } from '../services/api';

export default function SmartContract() {
    const [formData, setFormData] = useState({
        fpo: '',
        buyer: '',
        crop: '',
        tons: ''
    });
    const [loading, setLoading] = useState(false);
    const [contractResult, setContractResult] = useState('');
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setContractResult('');

        try {
            // Convert tons to an integer before sending
            const payload = {
                ...formData,
                tons: parseInt(formData.tons, 10) || 0
            };
            
            const data = await generateContract(payload);
            // Assuming the backend returns the generated text under a 'contract' or 'text' key, or simply just the string
            setContractResult(data.contract || data.text || JSON.stringify(data, null, 2));
        } catch (err) {
            setError('Failed to generate contract. Please check your backend connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 flex flex-col pb-20">
            <div className="bg-blue-600 text-white p-4 pt-8 pb-4 rounded-b-3xl shadow-lg mb-4">
                <h2 className="text-2xl font-bold mb-1">AI Smart Contract</h2>
                <p className="text-blue-100 text-sm">Draft secure B2B agreements instantly.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="px-5 space-y-5 flex-1">
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">FPO Name</label>
                        <input 
                            type="text" 
                            name="fpo"
                            value={formData.fpo}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Kisan Samridhi FPO"
                            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Buyer Name</label>
                        <input 
                            type="text" 
                            name="buyer"
                            value={formData.buyer}
                            onChange={handleChange}
                            required
                            placeholder="e.g., FreshMart India"
                            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Crop</label>
                        <input 
                            type="text" 
                            name="crop"
                            value={formData.crop}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Tomato"
                            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (Tons)</label>
                        <input 
                            type="number" 
                            name="tons"
                            value={formData.tons}
                            onChange={handleChange}
                            required
                            min="1"
                            placeholder="e.g., 50"
                            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow transition duration-150 disabled:opacity-50 flex items-center justify-center"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating Contract...
                        </>
                    ) : (
                        'Generate Smart Contract'
                    )}
                </button>
            </form>

            {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded text-sm">
                    {error}
                </div>
            )}

            {contractResult && (
                <div className="mt-6">
                    <h3 className="font-semibold text-gray-700 mb-2">Drafted Agreement</h3>
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg h-64 overflow-y-auto">
                        <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
                            {contractResult}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}
