'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UploadButton from '@/components/UploadButton'; 

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [name]: isCheckbox ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      imageUrl: form.imageUrl.trim(),
      price: parseFloat(form.price),
      quantity: parseFloat(form.quantity),
      category: form.category.trim(),
      bundleWith: form.bundleWith.trim() || null,
      discountedPrice: form.discountedPrice
        ? parseFloat(form.discountedPrice)
        : null,
      allowFractional: form.allowFractional,
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('❌ Product save failed:', errorData.message);
        return;
      }

      router.push('/dashboard/products');
    } catch (error) {
      console.error('❌ Error saving product:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="input"
          required
        />

        {/* ✅ Cloudinary Upload */}
        <div>
          <UploadButton
            onUpload={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
          />
          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="Uploaded"
              className="w-40 h-40 mt-2 object-cover rounded border"
            />
          )}
        </div>

        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          type="number"
          step="0.01"
          min="0"
          className="input"
          required
        />
        <input
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          type="number"
          min="0"
          className="input"
          required
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="input"
        />
        <input
          name="discountedPrice"
          value={form.discountedPrice}
          onChange={handleChange}
          placeholder="Discounted Price (for 2+)"
          type="number"
          step="0.01"
          min="0"
          className="input"
        />
        <input
          name="bundleWith"
          value={form.bundleWith}
          onChange={handleChange}
          placeholder="Bundle Product ID (optional)"
          className="input"
        />

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="allowFractional"
            checked={form.allowFractional}
            onChange={handleChange}
          />
          <span>Allow fractional sales (e.g., 0.5)</span>
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Save Product
        </button>
      </form>
    </div>
  );
}
