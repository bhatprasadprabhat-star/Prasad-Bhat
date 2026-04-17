
import React, { useState, useRef } from 'react';
import { CityData } from '../types';
import { searchCities } from '../services/gemini';
import { LoadingIndicator } from './LoadingIndicator';
import { MapPin, Navigation } from 'lucide-react';

interface CitySearchProps {
  value: string;
  onChange: (v: CityData) => void;
  placeholder?: string;
}

const CitySearch: React.FC<CitySearchProps> = ({ value, onChange, placeholder }) => {
  const [suggestions, setSuggestions] = useState<CityData[]>([]);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const timer = useRef<any>(null);

  const fetchSuggestions = async (val: string) => {
    if (val.length < 1) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      const cities = await searchCities(val);
      setSuggestions(cities);
      setShow(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInput = (val: string) => {
    onChange({ name: val, lat: '', lon: '', tz: '' });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // Simple TZ offset calculation
        const offset = -new Date().getTimezoneOffset();
        const hours = Math.floor(Math.abs(offset) / 60);
        const mins = Math.abs(offset) % 60;
        const sign = offset >= 0 ? "+" : "-";
        const tz = `${sign}${hours.toString().padStart(1, '0')}:${mins.toString().padStart(2, '0')}`;

        const locationData: CityData = {
          name: `Current Location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`,
          lat: latitude.toString(),
          lon: longitude.toString(),
          tz: tz,
          pincode: 'N/A'
        };
        
        onChange(locationData);
        setIsLocating(false);
        setShow(false);
      },
      (error) => {
        console.error("Error fetching location:", error);
        setIsLocating(false);
        alert("Could not fetch your location. Please search manually.");
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input 
          value={value} 
          onChange={e => handleInput(e.target.value)} 
          placeholder={placeholder || "Search City..."} 
          className="w-full bg-[var(--bg-primary)]/50 border-2 border-[var(--border-primary)] rounded-lg p-4 text-sm sm:text-base font-premium font-bold text-[var(--text-primary)] focus:border-[var(--accent-primary)] outline-none shadow-inner placeholder:text-[var(--text-primary)]/70 backdrop-blur-md pr-12" 
          onFocus={() => setShow(true)} 
          onBlur={() => setTimeout(() => setShow(false), 250)} 
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isLoading || isLocating ? <LoadingIndicator size={16} /> : <MapPin size={18} className="text-[var(--accent-primary)]/70" />}
        </div>
      </div>

      {show && (
        <div className="absolute z-50 left-0 right-0 top-full mt-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg shadow-2xl overflow-hidden max-h-80 overflow-y-auto backdrop-blur-2xl p-1">
          {/* Current Location Quick Option */}
          <button 
            onMouseDown={handleCurrentLocation}
            className="w-full px-5 py-4 text-left text-sm font-ancient font-black text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 transition-all flex items-center gap-3 border-b border-[var(--border-primary)]/20 uppercase tracking-widest"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center">
              <Navigation size={14} className={isLocating ? "animate-pulse" : ""} />
            </div>
            <span>Use Current Location</span>
          </button>

          {suggestions.map((city, i) => (
            <button 
              key={i} 
              onMouseDown={() => { onChange(city); setShow(false); }} 
              className="w-full px-5 py-4 text-left text-sm font-premium font-bold text-[var(--text-primary)] hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)] transition-all border-b border-[var(--border-primary)]/10 last:border-0"
            >
              <div className="flex flex-col gap-0.5">
                <span className="tracking-wide text-base">{city.name}</span>
                <div className="flex items-center gap-2 opacity-70">
                  <span className="text-[10px] font-ancient font-black uppercase tracking-widest">PIN: {city.pincode || '----'}</span>
                  <span className="text-[10px]">•</span>
                  <span className="text-[10px] font-ancient font-black uppercase tracking-widest">TZ: {city.tz}</span>
                </div>
              </div>
            </button>
          ))}
          
          {isLoading && suggestions.length === 0 && (
            <div className="p-8 text-center text-[var(--accent-primary)]/60 font-ancient font-bold uppercase tracking-widest text-[10px]">
              Searching Stars...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CitySearch;
