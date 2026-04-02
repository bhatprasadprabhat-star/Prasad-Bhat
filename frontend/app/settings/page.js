'use client';

import { useState } from 'react';
import { api } from '../../lib/api';

export default function SettingsPage() {
  const [message, setMessage] = useState('Need pricing details for your service');
  const [tone, setTone] = useState('professional');
  const [reply, setReply] = useState('');

  async function generate() {
    const data = await api('/ai/reply', { method: 'POST', body: JSON.stringify({ message, tone, context: 'customer query' }) });
    setReply(data.text);
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="card">
        <h3 className="font-semibold">AI Smart Replies</h3>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="mt-2 h-24 w-full rounded-lg border p-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
        <select value={tone} onChange={(e) => setTone(e.target.value)} className="mt-2 w-full rounded-lg border p-2 text-sm dark:border-slate-700 dark:bg-slate-950">
          <option value="professional">Professional</option>
          <option value="friendly">Friendly</option>
          <option value="sales">Sales</option>
        </select>
        <button onClick={generate} className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">Generate Reply</button>
        {reply && <p className="mt-3 rounded bg-slate-100 p-2 text-sm dark:bg-slate-800">{reply}</p>}
      </div>
      <div className="card">
        <h3 className="font-semibold">Integrations</h3>
        <ul className="mt-2 list-disc pl-5 text-sm">
          <li>WhatsApp API via webhook mock</li>
          <li>Email via SMTP/Gmail endpoint mock</li>
          <li>Google Sheets / DB support via webhook action</li>
          <li>Time-based triggers using cron expression in workflow API</li>
        </ul>
      </div>
    </div>
  );
}
