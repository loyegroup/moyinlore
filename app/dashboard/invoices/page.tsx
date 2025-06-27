'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Invoice {
  _id: string;
  customer: string;
  items: { name: string; quantity: number; price: number }[];
  date: string;
  status: 'paid' | 'unpaid' | 'partially';
  amountPaid?: number;
  amountOwed?: number;
  cashPayment?: number;
  onlinePayment?: number;
}

type Role = 'admin' | 'superAdmin';

export default function InvoicePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState('');
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/invoices')
      .then((res) => res.json())
      .then(setInvoices)
      .catch(() => console.error('Failed to fetch invoices'));
  }, []);

  if (status === 'loading') return <p>Loading...</p>;

  const role = session?.user && 'role' in session.user ? (session.user.role as Role) : undefined;
  const isAuthorized = role === 'admin' || role === 'superAdmin';

  if (!session || !isAuthorized) return <p className="text-red-500">Access denied.</p>;

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

  const exportSingleInvoice = (invoice: Invoice) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Invoice #${invoice._id}`, 14, 20);
    doc.setFontSize(12);

    doc.text(`Customer: ${invoice.customer}`, 14, 30);
    doc.text(`Date: ${invoice.date}`, 14, 37);
    doc.text(`Status: ${invoice.status}`, 14, 44);
    doc.text(`Cash Payment: ${formatCurrency(invoice.cashPayment || 0)}`, 14, 51);
    doc.text(`Online Payment: ${formatCurrency(invoice.onlinePayment || 0)}`, 14, 58);
    doc.text(`Amount Paid: ${formatCurrency(invoice.amountPaid || 0)}`, 14, 65);
    doc.text(`Amount Owed: ${formatCurrency(invoice.amountOwed || 0)}`, 14, 72);

    autoTable(doc, {
      head: [['Product', 'Qty', 'Price', 'Subtotal']],
      body: invoice.items.map((item) => [
        item.name,
        item.quantity,
        formatCurrency(item.price),
        formatCurrency(item.quantity * item.price),
      ]),
      startY: 80,
    });

    doc.save(`invoice_${invoice._id}.pdf`);
  };

  const handleDeleteInvoice = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;

    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete invoice');
      setInvoices((prev) => prev.filter((inv) => inv._id !== id));
    } catch (err) {
      alert('Error deleting invoice');
      console.error(err);
    }
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

      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <input
          type="text"
          placeholder="Search invoices..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white w-full sm:w-80"
        />
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

            const isOpen = expandedInvoiceId === invoice._id;

            return (
              <div
                key={invoice._id}
                className="p-4 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
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
                            : invoice.status === 'partially'
                            ? 'text-yellow-500'
                            : 'text-red-500'
                        }
                      >
                        {invoice.status}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-3 items-center">
                    <p className="text-md font-bold text-gray-900 dark:text-white">
                      {formatCurrency(total)}
                    </p>
                    <button
                      onClick={() =>
                        setExpandedInvoiceId(isOpen ? null : invoice._id)
                      }
                      className="text-sm text-blue-600 underline"
                    >
                      {isOpen ? 'Hide' : 'View'}
                    </button>
                    <button
                      onClick={() => exportSingleInvoice(invoice)}
                      className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
                    >
                      Download PDF
                    </button>
                    {role === 'superAdmin' && (
                      <button
                        onClick={() => handleDeleteInvoice(invoice._id)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                    <table className="w-full mb-4 border border-gray-300 dark:border-gray-600 text-sm">
                      <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                          <th className="p-2 text-left">Product</th>
                          <th className="p-2">Qty</th>
                          <th className="p-2">Price</th>
                          <th className="p-2">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.items.map((item, i) => (
                          <tr key={i} className="text-center border-t dark:border-gray-700">
                            <td className="p-2 text-left">{item.name}</td>
                            <td className="p-2">{item.quantity}</td>
                            <td className="p-2">{formatCurrency(item.price)}</td>
                            <td className="p-2">
                              {formatCurrency(item.quantity * item.price)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p>
                      Cash: {formatCurrency(invoice.cashPayment || 0)} | Online:{' '}
                      {formatCurrency(invoice.onlinePayment || 0)}
                    </p>
                    <p>
                      Total Paid: {formatCurrency(invoice.amountPaid || 0)} | Amount Owed:{' '}
                      {formatCurrency(invoice.amountOwed || 0)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
