// app/dashboard/page.tsx
'use client';

import { motion } from 'framer-motion';

export default function DashboardHome() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-bold mb-4">Welcome, Admin</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Here you can manage your products, invoices, and more.
      </p>
    </motion.div>
  );
}
