
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
    <div className={`flex flex-col gap-4 w-full ${className}`}>
      <div className="flex flex-col items-center gap-2">
        <span className="text-[10px] font-ancient font-black text-[var(--accent-primary)]/80 uppercase tracking-[0.3em]">Selected Time</span>
        <div className="bg-[var(--bg-secondary)]/60 backdrop-blur-2xl border-2 border-[var(--accent-primary)] rounded-2xl px-10 py-4 shadow-[0_0_40px_rgba(212,175,55,0.3)] min-w-[200px] text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--accent-primary)]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <span className="text-2xl sm:text-4xl font-ancient font-black gold-leaf tracking-[0.2em] drop-shadow-2xl">
            {h}:{m} {ampm}
          </span>
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[var(--accent-primary)] m-1"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[var(--accent-primary)] m-1"></div>
        </div>
      </div>
      <div className="flex gap-2 w-full">
        <div className="flex-1 relative">
          <select 
            value={h} 
            onChange={e => onChange(`${e.target.value}:${m}`, ampm)} 
            className="details-input text-center appearance-none cursor-pointer w-full bg-white/5 font-premium font-bold text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 rounded-lg p-4 backdrop-blur-md focus:border-[var(--accent-primary)] outline-none"
          >
            {HOURS.map(hour => <option key={hour} value={hour} className="bg-[var(--bg-secondary)] text-[var(--accent-primary)]">{hour}</option>)}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--accent-primary)]/60 text-[10px]">▼</div>
        </div>
        <span className="flex items-center font-ancient font-black text-[var(--accent-primary)] text-lg">:</span>
        <div className="flex-1 relative">
          <select 
            value={m} 
            onChange={e => onChange(`${h}:${e.target.value}`, ampm)} 
            className="details-input text-center appearance-none cursor-pointer w-full bg-white/5 font-premium font-bold text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 rounded-lg p-4 backdrop-blur-md focus:border-[var(--accent-primary)] outline-none"
          >
            {MINUTES.map(min => <option key={min} value={min} className="bg-[var(--bg-secondary)] text-[var(--accent-primary)]">{min}</option>)}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--accent-primary)]/60 text-[10px]">▼</div>
        </div>
        <div className="w-20 sm:w-28 relative">
          <select 
            value={ampm} 
            onChange={e => onChange(time, e.target.value)} 
            className="details-input text-center appearance-none cursor-pointer w-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-ancient font-black border border-[var(--accent-primary)]/30 rounded-lg p-4 backdrop-blur-md focus:border-[var(--accent-primary)] outline-none"
          >
            <option value="AM" className="bg-[var(--bg-secondary)] text-[var(--accent-primary)]">AM</option>
            <option value="PM" className="bg-[var(--bg-secondary)] text-[var(--accent-primary)]">PM</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TimePicker;
