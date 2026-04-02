'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { api } from '../lib/api';

export default function AppShell({ children }) {
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState('en');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  useEffect(() => {
    api('/notifications').then(setNotifications).catch(() => setNotifications([]));
  }, []);

  return (
    <div className="md:flex">
      <Sidebar lang={lang} />
      <main className="min-h-screen flex-1 p-4 md:p-6">
        <Topbar dark={dark} setDark={setDark} lang={lang} setLang={setLang} notifications={notifications} />
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          {children}
        </motion.div>
      </main>
    </div>
  );
}
