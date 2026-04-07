
import React from 'react';
import { HOURS, MINUTES } from '../constants';

interface TimePickerProps {
  time: string;
  ampm: string;
  onChange: (time: string, ampm: string) => void;
  className?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({ time, ampm, onChange, className = "" }) => {
  const [h, m] = (time || '12:00').split(':');
  return (
    <div className={`flex gap-1.5 w-full ${className}`}>
      <div className="flex-1 relative">
        <select 
          value={h} 
          onChange={e => onChange(`${e.target.value}:${m}`, ampm)} 
          className="details-input text-center appearance-none cursor-pointer w-full bg-white font-bold text-[#451a03] border-2 border-[#D4AF37]/20 rounded-2xl p-4"
        >
          {HOURS.map(hour => <option key={hour} value={hour}>{hour}</option>)}
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#451a03] text-[10px]">▼</div>
      </div>
      <span className="flex items-center font-black text-[#451a03] text-lg">:</span>
      <div className="flex-1 relative">
        <select 
          value={m} 
          onChange={e => onChange(`${h}:${e.target.value}`, ampm)} 
          className="details-input text-center appearance-none cursor-pointer w-full bg-white font-bold text-[#451a03] border-2 border-[#D4AF37]/20 rounded-2xl p-4"
        >
          {MINUTES.map(min => <option key={min} value={min}>{min}</option>)}
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#451a03] text-[10px]">▼</div>
      </div>
      <div className="w-18 sm:w-24 relative">
        <select 
          value={ampm} 
          onChange={e => onChange(time, e.target.value)} 
          className="details-input text-center appearance-none cursor-pointer w-full bg-[#451a03] text-[#D4AF37] font-black border-2 border-[#D4AF37]/20 rounded-2xl p-4"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
};

export default TimePicker;
