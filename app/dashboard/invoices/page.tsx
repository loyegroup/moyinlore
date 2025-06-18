'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

//(autoTable as any)(jsPDF.prototype);

interface Invoice {
  _id: string;
  customer: string;
  items: { name: string; quantity: number; price: number }[];
  date: string;
  status: 'paid' | 'unpaid';
}

export default function InvoicePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch('/api/invoices');
        const data = await res.json();
        setInvoices(data);
      } catch (error) {
        console.error('Failed to fetch invoices:', error);
      }
    };
    fetchInvoices();
  }, []);

  if (status === 'loading') return <p>Loading...</p>;
  if (!session || !['admin', 'superAdmin'].includes(session.user.role)) {
    return <p className="text-red-500">Access denied.</p>;
  }

  const filtered = invoices.filter((invoice) => {
    const lower = search.toLowerCase();
    return (
      invoice.customer.toLowerCase().includes(lower) ||
      invoice.status.toLowerCase().includes(lower) ||
      invoice.items.some((item) => item.name.toLowerCase().includes(lower))
    );
  });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Invoice Report', 14, 20);

    autoTable(doc, {
      head: [['Invoice ID', 'Customer', 'Date', 'Total', 'Status']],
      body: filtered.map((inv) => [
        inv._id,
        inv.customer,
        inv.date,
        formatCurrency(
          inv.items.reduce((total, item) => total + item.price * item.quantity, 0)
        ),
        inv.status,
      ]),
      startY: 30,
    });

    doc.save('invoices.pdf');
  };

  return (
    <motion.div
      className="max-w-5xl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <button
          onClick={() => router.push('/dashboard/invoices/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Invoice
        </button>
      </div>

      <div className="mb-6 flex justify-between gap-4 flex-col sm:flex-row">
        <input
          type="text"
          placeholder="Search invoices..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white w-full sm:w-80"
        />

        <button
          onClick={handleExportPDF}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Export PDF
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No invoices found.</p>
      ) : (
        <div className="space-y-6">
          {filtered.map((invoice) => {
            const total = invoice.items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );
            return (
              <div
                key={invoice._id}
                className="p-4 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {invoice._id} - {invoice.customer}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Date: {invoice.date} • Status:{' '}
                      <span
                        className={
                          invoice.status === 'paid'
                            ? 'text-green-500'
                            : 'text-yellow-500'
                        }
                      >
                        {invoice.status}
                      </span>
                    </p>
                  </div>
                  <p className="text-md font-bold text-gray-900 dark:text-white">
                    {formatCurrency(total)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
