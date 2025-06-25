'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import UploadButton from '@/components/UploadButton';

export default function EditProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const id = searchParams.get('id');

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error('Failed to load product');
        const data = await res.json();
        setForm({
          name: data.name,
          imageUrl: data.imageUrl || '',
          price: data.price.toString(),
          quantity: data.quantity.toString(),
          category: data.category || '',
          bundleWith: data.bundleWith || '',
          discountedPrice: data.discountedPrice?.toString() || '',
          allowFractional: data.allowFractional || false,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load product');
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // ✅ Safe session and role check using inline type assertion
  if (
    status !== 'authenticated' ||
    !session.user ||
    (session.user as { role?: string })?.role !== 'superAdmin'
  ) {
    return <p className="text-red-500">Access denied. Super admin only.</p>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      name: form.name.trim(),
      imageUrl: form.imageUrl.trim(),
      price: parseFloat(form.price),
      quantity: parseFloat(form.quantity),
      category: form.category.trim(),
      bundleWith: form.bundleWith || null,
      discountedPrice: form.discountedPrice
        ? parseFloat(form.discountedPrice)
        : null,
      allowFractional: form.allowFractional,
    };

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || 'Failed to update product');
      }

      router.push('/dashboard/products');
    } catch (err: any) {
      setError(err.message || 'Failed to update product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>

      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="input"
          required
        />

        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded border"
          />
        )}

        <UploadButton onUpload={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))} />

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
          <span>Allow fractional sales</span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
}
