'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  bundleWith?: string | null;
  discountedPrice?: number | null;
  allowFractional?: boolean;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [customer, setCustomer] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState('unpaid');
  const [cashPayment, setCashPayment] = useState(0);
  const [onlinePayment, setOnlinePayment] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const amountPaid = cashPayment + onlinePayment;
  const total = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const amountOwed = Math.max(0, total - amountPaid);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts)
      .catch(() => setError('Failed to load products'));
  }, []);

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;

    const quantity = 1;
    const price = quantity >= 2 && product.discountedPrice ? product.discountedPrice : product.price;

    const updatedItems = [...items];
    updatedItems[index] = {
      productId,
      name: product.name,
      quantity,
      price,
      maxQuantity: product.quantity,
      allowFractional: product.allowFractional,
    };

    if (product.bundleWith && !updatedItems.find(i => i.productId === product.bundleWith)) {
      const bundled = products.find(p => p._id === product.bundleWith);
      if (bundled) {
        updatedItems.push({
          productId: bundled._id,
          name: bundled.name,
          quantity: 1,
          price: bundled.price,
          maxQuantity: bundled.quantity,
          allowFractional: bundled.allowFractional,
        });
      }
    }

    setItems(updatedItems);
  };

  const handleItemChange = (index: number, value: number) => {
    const updated = [...items];
    const item = updated[index];
    const product = products.find((p) => p._id === item.productId);
    if (!product) return;

    const valid = product.allowFractional ? value <= product.quantity : Number.isInteger(value) && value <= product.quantity;
    if (!valid) return;

    const price = value >= 2 && product.discountedPrice ? product.discountedPrice : product.price;
    item.quantity = value;
    item.price = price;

    setItems(updated);
  };

  const handleAddItem = () => setItems([...items, { productId: '', quantity: 1, price: 0 }]);
  const handleRemoveItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!customer || items.length === 0 || total <= 0) {
      setError('Please complete all fields');
      return;
    }

    const invoiceData = {
      customer,
      date: new Date().toISOString(),
      status,
      cashPayment,
      onlinePayment,
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
      setError(result.error || 'Failed to create invoice');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-md shadow">
      <h1 className="text-3xl font-bold mb-6">🧾 New Invoice</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-1">Customer Name</label>
          <input
            type="text"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            className="input w-full"
            required
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-300 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-3 py-2 text-left">Product</th>
                <th className="px-3 py-2">Qty</th>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2">Subtotal</th>
                <th className="px-3 py-2">Remove</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} className="border-t text-center dark:border-gray-700">
                  <td className="p-2">
                    <select
                      value={item.productId}
                      onChange={(e) => handleProductChange(idx, e.target.value)}
                      className="input w-full"
                      required
                    >
                      <option value="">Select</option>
                      {products.map((p) => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, +e.target.value)}
                      className="input w-20 text-center"
                    />
                  </td>
                  <td className="p-2">₦{item.price.toLocaleString()}</td>
                  <td className="p-2">₦{(item.quantity * item.price).toLocaleString()}</td>
                  <td className="p-2">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="text-red-500 text-xs hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button type="button" onClick={handleAddItem} className="text-sm text-blue-600 hover:underline">
          + Add another item
        </button>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Cash Payment (₦)</label>
            <input
              type="number"
              value={cashPayment}
              onChange={(e) => setCashPayment(+e.target.value)}
              className="input w-full"
              placeholder="e.g. 2000"
            />
          </div>
          <div>
            <label className="block font-medium">Online Payment (₦)</label>
            <input
              type="number"
              value={onlinePayment}
              onChange={(e) => setOnlinePayment(+e.target.value)}
              className="input w-full"
              placeholder="e.g. 1000"
            />
          </div>
        </div>

        <div className="text-right text-lg mt-4 font-semibold">
          Total: ₦{total.toLocaleString()}
        </div>
        <div className="text-right text-gray-700 dark:text-gray-300">
          Credit Owed: <strong>₦{amountOwed.toLocaleString()}</strong>
        </div>

        <div>
          <label className="block font-medium">Payment Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input w-full">
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
            <option value="partially">Partially Paid</option>
          </select>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Save Invoice
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
      </form>
    </div>
  );
}
