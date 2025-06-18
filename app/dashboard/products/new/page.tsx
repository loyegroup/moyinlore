'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProductPage() {
  const [form, setForm] = useState({
    name: '',
    imageUrl: '',
    price: '',
    quantity: '',
    category: '',
    bundleWith: '',
    discountedPrice: '',
    allowFractional: false,
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      price: parseFloat(form.price),
      quantity: parseFloat(form.quantity),
      discountedPrice: form.discountedPrice ? parseFloat(form.discountedPrice) : null,
      bundleWith: form.bundleWith || null,
    };

    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    router.push('/dashboard/products');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" className="input" required />
        <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="Image URL" className="input" />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" className="input" required />
        <input name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity" type="number" className="input" required />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="input" />

        <input name="discountedPrice" value={form.discountedPrice} onChange={handleChange} placeholder="Discounted Price (for 2+)" type="number" className="input" />
        <input name="bundleWith" value={form.bundleWith} onChange={handleChange} placeholder="Bundle Product ID (optional)" className="input" />

        <label className="flex items-center space-x-2">
          <input type="checkbox" name="allowFractional" checked={form.allowFractional} onChange={handleChange} />
          <span>Allow fractional sales (e.g., 0.5)</span>
        </label>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Product</button>
      </form>
    </div>
  );
}
