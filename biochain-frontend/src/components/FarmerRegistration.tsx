import React, { useState } from 'react';
import { MapPin, Loader2, CheckCircle2 } from 'lucide-react';

export default function FarmerRegistration() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    fpo: '',
    farmSize: '',
    latitude: '',
    longitude: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          alert('Unable to retrieve location. Please check your browser permissions.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Farmer Registered Successfully! ID: FRM-8842');
      
      setFormData({
        fullName: '',
        phone: '',
        fpo: '',
        farmSize: '',
        latitude: '',
        longitude: ''
      });

      setTimeout(() => setSuccessMessage(null), 5000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-zinc-950 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.1)] border border-amber-500/20 overflow-hidden mt-8 mb-8">
        <div className="bg-amber-500/5 border-b border-amber-500/20 px-8 py-6">
          <h1 className="text-2xl font-bold text-amber-500">BioChain Direct</h1>
          <p className="text-zinc-400 mt-1">Farmer & Field Registration Module</p>
        </div>

        <div className="p-8">
          {successMessage && (
            <div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <p className="text-amber-400 font-medium">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-zinc-300 mb-1">
                Farmer Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="e.g., Ramesh Kumar"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-zinc-700 bg-zinc-900 text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow placeholder-zinc-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-zinc-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="+91 "
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-zinc-700 bg-zinc-900 text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow placeholder-zinc-500"
                />
              </div>

              <div>
                <label htmlFor="fpo" className="block text-sm font-medium text-zinc-300 mb-1">
                  FPO Affiliation
                </label>
                <select
                  id="fpo"
                  name="fpo"
                  value={formData.fpo}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-zinc-700 bg-zinc-900 text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow"
                >
                  <option value="" disabled>Select an FPO...</option>
                  <option value="Nashik Onion FPO">Nashik Onion FPO</option>
                  <option value="Kolar Tomato Hub">Kolar Tomato Hub</option>
                  <option value="Guntur Spice Co-op">Guntur Spice Co-op</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="farmSize" className="block text-sm font-medium text-zinc-300 mb-1">
                Farm Size (in Acres)
              </label>
              <input
                type="number"
                id="farmSize"
                name="farmSize"
                placeholder="e.g., 5.5"
                step="0.1"
                min="0"
                value={formData.farmSize}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-zinc-700 bg-zinc-900 text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow placeholder-zinc-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Location Coordinates (Lat / Long)
              </label>
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  name="latitude"
                  placeholder="Latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  required
                  className="w-full md:flex-1 px-4 py-2 border border-zinc-700 bg-zinc-900 text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow placeholder-zinc-500"
                />
                <input
                  type="text"
                  name="longitude"
                  placeholder="Longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  required
                  className="w-full md:flex-1 px-4 py-2 border border-zinc-700 bg-zinc-900 text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow placeholder-zinc-500"
                />
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="w-full md:w-auto flex justify-center items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-lg border border-zinc-700 transition-colors whitespace-nowrap"
                >
                  <MapPin className="w-4 h-4 text-amber-500" />
                  Get Current Location
                </button>
              </div>
            </div>

            <div className="pt-4 mt-8 border-t border-zinc-800">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-bold rounded-lg text-lg transition-all focus:outline-none focus:ring-4 focus:ring-amber-500/30 disabled:opacity-80 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(245,158,11,0.2)]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying & Registering...
                  </>
                ) : (
                  'Verify & Register Farmer'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
