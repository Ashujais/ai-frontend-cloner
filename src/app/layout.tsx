import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Frontend Website Cloning Agent',
  description:
    'Autonomous AI Agent that accepts any website URL, recreates its UI in React/Next.js, validates code, and enables natural-language modifications.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
