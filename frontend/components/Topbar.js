'use client';

import { Bell } from 'lucide-react';

export default function Topbar({ dark, setDark, lang, setLang, notifications = [] }) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold">Welcome to AutoFlow AI</h2>
        <p className="text-xs text-slate-500">Automate WhatsApp, email, leads, and social outreach.</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="rounded-lg bg-slate-200 px-3 py-2 text-xs dark:bg-slate-800">{lang.toUpperCase()}</button>
        <button onClick={() => setDark(!dark)} className="rounded-lg bg-slate-200 px-3 py-2 text-xs dark:bg-slate-800">{dark ? 'Light' : 'Dark'}</button>
        <div className="relative rounded-lg bg-slate-200 p-2 dark:bg-slate-800">
          <Bell size={16} />
          <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1 text-[10px] text-white">{notifications.length}</span>
        </div>
      </div>
    </div>
  );
}
