'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Link from 'next/link';

interface Invoice {
  id: string;
  customer: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  date: string;
}

const mockInvoices: Invoice[] = [
  {
    id: 'INV001',
    customer: 'John Doe',
    items: [
      { name: 'Laptop', quantity: 1, price: 2500 },
      { name: 'Mouse', quantity: 2, price: 25 },
    ],
    total: 2550,
    date: '2025-06-13T09:30:00Z',
  },
  {
    id: 'INV002',
    customer: 'Jane Smith',
    items: [
      { name: 'Desk Chair', quantity: 1, price: 150 },
      { name: 'Bookshelf', quantity: 1, price: 80 },
    ],
    total: 230,
    date: '2025-06-13T10:15:00Z',
  },
];

export default function InvoicePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    // Simulate fetch
    setInvoices(mockInvoices);
  }, []);

  const formatNaira = (amount: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);

  const handleDownload = (invoice: Invoice) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Invoice', 14, 20);

    doc.setFontSize(12);
    doc.text(`Invoice ID: ${invoice.id}`, 14, 30);
    doc.text(`Customer: ${invoice.customer}`, 14, 38);
    doc.text(
      `Date: ${new Date(invoice.date).toLocaleDateString('en-NG')}`,
      14,
      46
    );

    const tableData = invoice.items.map((item) => [
      item.name,
      item.quantity,
      formatNaira(item.price),
      formatNaira(item.quantity * item.price),
    ]);

    doc.autoTable({
      startY: 55,
      head: [['Item', 'Qty', 'Unit Price', 'Subtotal']],
      body: tableData,
    });

    doc.text(
      `Total: ${formatNaira(invoice.total)}`,
      14,
      doc.autoTable.previous.finalY + 10
    );

    doc.save(`${invoice.id}.pdf`);
  };

  return (
    <motion.div
      className="max-w-5xl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-bold mb-6">Invoices</h1>

      <Link href="/dashboard/invoices/new" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
        + Create New Invoice
      </Link>

      {invoices.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No invoices available.</p>
      ) : (
        <div className="space-y-4">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-sm"
            >
              <div className="flex justify-between flex-wrap gap-4 items-center">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    Invoice #{inv.id}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Customer: {inv.customer}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total: {formatNaira(inv.total)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Date: {new Date(inv.date).toLocaleString('en-NG', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>

                <button
                  onClick={() => handleDownload(inv)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
                >
                  Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
