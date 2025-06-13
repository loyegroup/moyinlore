// app/dashboard/layout.tsx
'use client';

import { useTheme } from 'next-themes';
import Link from 'next/link';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 dark:bg-gray-800 p-6 space-y-4 shadow-md">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <nav className="space-y-2">
          <Link href="/dashboard" className="block hover:text-blue-500">Home</Link>
          <Link href="/dashboard/products" className="block hover:text-blue-500">Products</Link>
          <Link href="/dashboard/invoices" className="block hover:text-blue-500">Invoices</Link>
          <Link href="/dashboard/activity" className="block hover:text-blue-500">Activity Logs</Link>
          <Link href="/dashboard/settings" className="block hover:text-blue-500">Settings</Link>
        </nav>

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="mt-8 text-sm bg-gray-300 dark:bg-gray-700 px-3 py-1 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          Toggle {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
