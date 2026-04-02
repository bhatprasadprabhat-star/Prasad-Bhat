'use client';

import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({ leads: 0, workflows: 0, runs: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api('/leads'), api('/workflows'), api('/workflows/runs/all')])
      .then(([leads, workflows, runs]) => setStats({ leads: leads.length, workflows: workflows.length, runs: runs.length }))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Object.entries(stats).map(([key, value]) => (
        <div key={key} className="card">
          <h3 className="text-sm capitalize text-slate-500">{key}</h3>
          <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>
      ))}
      {error && <p className="text-sm text-red-500">{error}. Login/register first with backend auth endpoints.</p>}
      <div className="card md:col-span-3">
        <h3 className="text-sm font-semibold">Monetization</h3>
        <p className="mt-2 text-sm">Free plan: up to 3 workflows. Pro plan: ₹499/month with higher automation limits.</p>
      </div>
    </div>
  );
}
