import './globals.css';
import AppShell from '../components/AppShell';

export const metadata = {
  title: 'AutoFlow AI',
  description: 'AI-powered business automation SaaS'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
