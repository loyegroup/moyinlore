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
  const [amountPaid, setAmountPaid] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;

    const quantity = 1;
    const priceToUse = quantity >= 2 && product.discountedPrice ? product.discountedPrice : product.price;

    const newItems = [...items];
    newItems[index] = {
      productId,
      name: product.name,
      quantity,
      price: priceToUse,
      maxQuantity: product.quantity,
      allowFractional: product.allowFractional,
    };

    // Auto-add bundle if necessary
    if (product.bundleWith && !newItems.find((i) => i.productId === product.bundleWith)) {
      const bundled = products.find((p) => p._id === product.bundleWith);
      if (bundled) {
        newItems.push({
          productId: bundled._id,
          name: bundled.name,
          quantity: 1,
          price: bundled.price,
          maxQuantity: bundled.quantity,
          allowFractional: bundled.allowFractional,
        });
      }
    }

    setItems(newItems);
  };

  const handleItemChange = (index: number, value: number) => {
    const updated = [...items];
    const item = updated[index];
    const product = products.find((p) => p._id === item.productId);
    if (!product) return;

    const maxQty = product.quantity;
    const valid = product.allowFractional ? value <= maxQty : Number.isInteger(value) && value <= maxQty;

    if (!valid) return;

    const price = value >= 2 && product.discountedPrice ? product.discountedPrice : product.price;
    item.quantity = value;
    item.price = price;

    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([...items, { productId: '', quantity: 1, price: 0 }]);
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
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-md shadow-md">
      <h1 className="text-3xl font-bold mb-6">🧾 New Invoice</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Customer Name"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          className="input w-full"
          required
        />

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-300 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Qty</th>
                <th className="px-3 py-2">Price (₦)</th>
                <th className="px-3 py-2">Subtotal</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} className="text-center border-t border-gray-200 dark:border-gray-700">
                  <td className="p-2">
                    <select
                      value={item.productId}
                      onChange={(e) => handleProductChange(idx, e.target.value)}
                      className="input w-full"
                      required
                    >
                      <option value="">Select Product</option>
                      {products.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name}
                        </option>
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
                      className="input w-24 text-center"
                    />
                  </td>
                  <td className="p-2">₦{item.price.toLocaleString()}</td>
                  <td className="p-2 font-medium">
                    ₦{(item.quantity * item.price).toLocaleString()}
                  </td>
                  <td className="p-2">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="text-red-500 hover:underline text-xs"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={handleAddItem}
          className="text-sm text-blue-600 hover:underline"
        >
          + Add another product
        </button>

        <div className="text-right font-semibold text-lg">
          Total: ₦{total.toLocaleString()}
        </div>

        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Amount Paid (₦)"
          value={amountPaid}
          onChange={(e) => setAmountPaid(+e.target.value)}
          className="input w-full"
        />

        <div className="text-right text-gray-700 dark:text-gray-300">
          Amount Owed: <strong>₦{amountOwed.toLocaleString()}</strong>
        </div>

        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input w-full">
          <option value="unpaid">Unpaid</option>
          <option value="paid">Paid</option>
          <option value="partially">Partially Paid</option>
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
