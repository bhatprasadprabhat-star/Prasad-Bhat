'use client';

import { useEffect, useState } from 'react';
import { API_URL, api } from '../../lib/api';

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '', email: '', tags: 'follow-up' });

  useEffect(() => {
    api('/leads').then(setLeads).catch(() => {});
  }, []);

  async function addLead(e) {
    e.preventDefault();
    const body = { ...form, tags: form.tags.split(',').map((x) => x.trim()) };
    const lead = await api('/leads', { method: 'POST', body: JSON.stringify(body) });
    setLeads((prev) => [lead, ...prev]);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <form className="card lg:col-span-1" onSubmit={addLead}>
        <h3 className="font-semibold">Add Lead</h3>
        {['name', 'email', 'phone', 'tags'].map((field) => (
          <input key={field} placeholder={field} value={form[field]} onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))} className="mt-2 w-full rounded-lg border p-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
        ))}
        <button className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">Save Lead</button>
      </form>
      <div className="card lg:col-span-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Lead Management</h3>
          <a className="rounded bg-slate-200 px-2 py-1 text-xs dark:bg-slate-800" href={`${API_URL}/leads/export.csv`} target="_blank">Export CSV</a>
        </div>
        {leads.map((lead) => (
          <div key={lead.id} className="mt-2 rounded-lg bg-slate-100 p-2 text-sm dark:bg-slate-800">
            <p className="font-medium">{lead.name} ({lead.phone})</p>
            <p className="text-xs text-slate-500">{lead.email}</p>
            <p className="text-xs">Tags: {lead.tags.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
