'use client';

import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

const actionCatalog = [
  { type: 'whatsapp', label: 'Send WhatsApp' },
  { type: 'email', label: 'Send Email' },
  { type: 'store-db', label: 'Store in DB' },
  { type: 'ai-reply', label: 'AI Smart Reply' },
  { type: 'webhook', label: 'Call Webhook' },
  { type: 'delay', label: 'Delay (1 min)', minutes: 1 }
];

export default function WorkflowsPage() {
  const [templates, setTemplates] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [actions, setActions] = useState([]);
  const [name, setName] = useState('Lead Followup Flow');
  const [error, setError] = useState('');

  useEffect(() => {
    api('/workflows/templates').then(setTemplates).catch((err) => setError(err.message));
    api('/workflows').then(setWorkflows).catch(() => {});
  }, []);

  const onDrop = (item) => setActions((prev) => [...prev, item]);

  async function createWorkflow() {
    try {
      const body = { name, trigger: 'lead.created', actions };
      const saved = await api('/workflows', { method: 'POST', body: JSON.stringify(body) });
      setWorkflows((prev) => [saved, ...prev]);
      setActions([]);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  async function runWorkflow(id) {
    await api(`/workflows/${id}/run`, { method: 'POST', body: JSON.stringify({ context: 'manual run' }) });
    alert('Workflow run started. Check logs in backend data.');
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="card lg:col-span-2">
        <h3 className="font-semibold">Drag-and-drop Workflow Builder</h3>
        <input value={name} onChange={(e) => setName(e.target.value)} className="mt-3 w-full rounded-lg border p-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs text-slate-500">Available actions</p>
            {actionCatalog.map((item) => (
              <button key={item.type + item.label} draggable onDragStart={(e) => e.dataTransfer.setData('app/action', JSON.stringify(item))} className="mb-2 block w-full rounded-lg bg-slate-100 px-3 py-2 text-left text-sm dark:bg-slate-800">
                {item.label}
              </button>
            ))}
          </div>
          <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(JSON.parse(e.dataTransfer.getData('app/action')))} className="min-h-40 rounded-lg border-2 border-dashed border-blue-400 p-3">
            <p className="text-xs text-slate-500">Drop actions here</p>
            {actions.map((action, idx) => <div key={`${action.type}-${idx}`} className="mt-2 rounded bg-blue-600/10 p-2 text-sm">{idx + 1}. {action.label || action.type}</div>)}
          </div>
        </div>
        <button onClick={createWorkflow} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">Save Workflow</button>
        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      </div>
      <div className="card">
        <h3 className="font-semibold">Automation Templates</h3>
        {templates.map((t) => <div key={t.id} className="mt-2 rounded-lg bg-slate-100 p-2 text-sm dark:bg-slate-800">{t.name}</div>)}
      </div>
      <div className="card lg:col-span-3">
        <h3 className="font-semibold">Saved Workflows</h3>
        {workflows.map((w) => (
          <div key={w.id} className="mt-2 flex items-center justify-between rounded-lg bg-slate-100 p-2 text-sm dark:bg-slate-800">
            <span>{w.name}</span>
            <button onClick={() => runWorkflow(w.id)} className="rounded bg-emerald-600 px-2 py-1 text-xs text-white">Run</button>
          </div>
        ))}
      </div>
    </div>
  );
}
