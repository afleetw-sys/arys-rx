import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'arys-rx Dashboard',
  description: 'Medication adherence management platform',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-100 text-neutral-900 antialiased">{children}</body>
    </html>
  );
}
