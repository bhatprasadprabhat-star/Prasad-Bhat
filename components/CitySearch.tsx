
import React, { useState, useRef } from 'react';
import { CityData } from '../types';
import { searchCities } from '../services/gemini';

interface CitySearchProps {
  value: string;
  onChange: (v: CityData) => void;
  placeholder?: string;
}

const CitySearch: React.FC<CitySearchProps> = ({ value, onChange, placeholder }) => {
  const [suggestions, setSuggestions] = useState<CityData[]>([]);
  const [show, setShow] = useState(false);
  const timer = useRef<any>(null);

  const fetchSuggestions = async (val: string) => {
    if (val.length < 1) return;
    const cities = await searchCities(val);
    setSuggestions(cities);
    setShow(true);
  };

  const handleInput = (val: string) => {
    onChange({ name: val, lat: '', lon: '', tz: '' });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  return (
    <div className="relative w-full">
      <input 
        value={value} 
        onChange={e => handleInput(e.target.value)} 
        placeholder={placeholder || "Search City..."} 
        className="w-full bg-amber-50/50 border-2 border-[#D4AF37]/20 rounded-2xl p-4 text-lg font-bold text-[#451a03] focus:border-[#D4AF37] outline-none shadow-inner" 
        onFocus={() => setShow(suggestions.length > 0)} 
        onBlur={() => setTimeout(() => setShow(false), 250)} 
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-md text-[#451a03]">📍</div>
      {show && suggestions.length > 0 && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border-2 border-[#D4AF37] rounded-xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto backdrop-blur-xl">
          {suggestions.map((city, i) => (
            <button 
              key={i} 
              onMouseDown={() => { onChange(city); setShow(false); }} 
              className="w-full px-4 py-3 text-left text-sm font-bold text-[#92400e] hover:bg-[#92400e] hover:text-[#D4AF37] transition-all border-b border-slate-200 last:border-0"
            >
              <div className="flex flex-col">
                <span>{city.name}</span>
                <span className="text-[10px] opacity-70">PIN: {city.pincode} • TZ: {city.tz}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CitySearch;
