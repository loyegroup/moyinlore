// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import AppProviders from '@/app/AppProviders';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'My Inventory App',
  description: 'Track your products',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}