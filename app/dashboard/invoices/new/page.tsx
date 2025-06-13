'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
// import { logActivity } from '@/lib/logActivity'; // Uncomment when connected to DB

type Item = {
  id: string;
  name: string;
  price: number;
};

type SelectedItem = {
  itemId: string;
  quantity: number;
};

const mockItems: Item[] = [
  { id: '1', name: 'Laptop', price: 2500 },
  { id: '2', name: 'Mouse', price: 30 },
  { id: '3', name: 'Desk Chair', price: 150 },
  { id: '4', name: 'Bookshelf', price: 80 },
];

export default function NewInvoicePage() {
  const [customer, setCustomer] = useState('');
  const [items, setItems] = useState<SelectedItem[]>([]);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const calculated = items.reduce((sum, entry) => {
      const item = mockItems.find((i) => i.id === entry.itemId);
      return sum + (item ? item.price * entry.quantity : 0);
    }, 0);
    setTotal(calculated);
  }, [items]);

  const formatNaira = (amount: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);

  const handleAddItem = () => {
    setItems([...items, { itemId: '', quantity: 1 }]);
  };

  const handleUpdateItem = (index: number, field: 'itemId' | 'quantity', value: string) => {
    const updated = [...items];
    if (field === 'quantity') {
      updated[index].quantity = Math.max(1, parseInt(value) || 1);
    } else {
      updated[index].itemId = value;
    }
    setItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const invoiceData = {
      customer,
      items: items.map(({ itemId, quantity }) => {
        const item = mockItems.find((i) => i.id === itemId);
        return {
          name: item?.name,
          price: item?.price,
          quantity,
        };
      }),
      total,
      date: new Date().toISOString(),
    };

    // Simulate API save
    console.log('🧾 New Invoice:', invoiceData);

    // await logActivity({
    //   user: 'admin@example.com',
    //   action: `Created invoice for ${customer}`,
    //   type: 'success',
    // });

    router.push('/dashboard/invoices');
  };

  return (
    <motion.div
      className="max-w-3xl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-bold mb-6">Create New Invoice</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          required
          placeholder="Customer Name"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />

        {/* Invoice Items */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Items</h2>
          {items.map((entry, index) => (
            <div key={index} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <select
                value={entry.itemId}
                onChange={(e) => handleUpdateItem(index, 'itemId', e.target.value)}
                className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="">Select Item</option>
                {mockItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({formatNaira(item.price)})
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                value={entry.quantity}
                onChange={(e) => handleUpdateItem(index, 'quantity', e.target.value)}
                className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddItem}
            className="bg-gray-200 dark:bg-gray-700 text-sm px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            + Add Item
          </button>
        </div>

        {/* Total */}
        <div className="text-lg font-semibold mt-4">
          Total: <span className="text-blue-600 dark:text-blue-400">{formatNaira(total)}</span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Save Invoice
        </button>
      </form>
    </motion.div>
  );
}
