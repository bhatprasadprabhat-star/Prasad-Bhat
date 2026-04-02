'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { dictionary } from '../lib/i18n';

const items = ['dashboard', 'workflows', 'leads', 'settings'];

export default function Sidebar({ lang = 'en' }) {
  const pathname = usePathname();
  return (
    <aside className="w-full border-b border-slate-200 p-4 dark:border-slate-800 md:h-screen md:w-64 md:border-r md:border-b-0">
      <h1 className="text-xl font-bold">AutoFlow AI</h1>
      <p className="mt-1 text-xs text-slate-500">Business Automation SaaS</p>
      <nav className="mt-6 flex gap-2 md:flex-col">
        {items.map((item) => {
          const href = `/${item}`;
          const active = pathname === href;
          return (
            <Link
              key={item}
              href={href}
              className={`rounded-xl px-3 py-2 text-sm ${active ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
            >
              {dictionary[lang][item]}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
