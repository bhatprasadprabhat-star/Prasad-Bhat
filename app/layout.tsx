import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AutoTube AI',
  description: 'AI-powered YouTube automation platform for Shorts and long-form.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
