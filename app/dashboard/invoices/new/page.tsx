'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewInvoicePage() {
  const router = useRouter();

  const [customer, setCustomer] = useState('');
  const [items, setItems] = useState([{ name: '', quantity: 1, price: 0 }]);
  const [status, setStatus] = useState('unpaid');
  const [amountPaid, setAmountPaid] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === 'quantity' || field === 'price' ? +value : value,
    };
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { name: '', quantity: 1, price: 0 }]);
  };

  const total = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const amountOwed = Math.max(0, total - amountPaid);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!customer || items.length === 0 || total <= 0) {
      setError('Please fill all required fields with valid data.');
      return;
    }

    if (amountPaid > total) {
      setError('Amount paid cannot exceed total invoice amount.');
      return;
    }

    const invoiceData = {
      customer,
      date: new Date().toISOString(),
      status,
      amountPaid,
      amountOwed,
      items,
    };

    const res = await fetch('/api/invoices/new', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoiceData),
    });

    if (res.ok) {
      setSuccess('✅ Invoice created successfully!');
      router.push('/dashboard/invoices');
    } else {
      const result = await res.json();
      setError(result.error || 'Failed to create invoice.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-md shadow">
      <h1 className="text-2xl font-bold mb-4">Create New Invoice</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Customer Name"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          className="input"
          required
        />

        {items.map((item, idx) => (
          <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Item Name"
              value={item.name}
              onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
              className="input"
              required
            />
            <input
              type="number"
              min="1"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => handleItemChange(idx, 'quantity', +e.target.value)}
              className="input"
              required
            />
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Price (₦)"
              value={item.price}
              onChange={(e) => handleItemChange(idx, 'price', +e.target.value)}
              className="input"
              required
            />
          </div>
        ))}

        <button type="button" onClick={handleAddItem} className="text-sm text-blue-600 hover:underline">
          + Add another item
        </button>

        <div className="text-right text-lg font-semibold">
          Total: ₦{total.toLocaleString()}
        </div>

        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Amount Paid (₦)"
          value={amountPaid}
          onChange={(e) => setAmountPaid(+e.target.value)}
          className="input"
        />

        <div className="text-right text-gray-700 dark:text-gray-300">
          Amount Owed: <strong>₦{amountOwed.toLocaleString()}</strong>
        </div>

        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input">
          <option value="unpaid">Unpaid</option>
          <option value="paid">Paid</option>
        </select>

        <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
          Save Invoice
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
      </form>
    </div>
  );
}
