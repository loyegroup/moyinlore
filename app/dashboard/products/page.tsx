'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  imageUrl?: string;
  bundleWith?: string | null;
  discountedPrice?: number | null;
  allowFractional?: boolean;
}

export default function ProductPage() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const router = useRouter();

  const isSuperAdmin = session?.user?.role === 'superAdmin';

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;

    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setProducts(prev => prev.filter(p => p._id !== id));
    } else {
      alert('Failed to delete product');
    }
  };

  if (status === 'loading') return <p>Loading...</p>;
  if (!session) return <p className="text-red-500">You must be logged in to manage products.</p>;

  const categories = ['all', ...new Set(products.map((p) => p.category))];

  const filtered = products.filter((p) => {
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatNaira = (amount: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);

  return (
    <motion.div
      className="max-w-6xl mx-auto px-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Product Inventory</h1>
        {isSuperAdmin && (
          <Link
            href="/dashboard/products/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
          >
            + Add New Product
          </Link>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-md w-full dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>

      {categories.filter((cat) => cat !== 'all').map((cat) => (
        <div key={cat} className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{cat}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filtered.filter((p) => p.category === cat).map((product) => (
              <div
                key={product._id}
                className="p-4 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-md space-y-2"
              >
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded"
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatNaira(product.price)} • {product.quantity}{' '}
                    {product.allowFractional ? 'units (fractional allowed)' : 'units'}
                  </p>
                  {product.discountedPrice && (
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                      Buy 2+ for {formatNaira(product.discountedPrice)} each
                    </p>
                  )}
                  {product.bundleWith && (
                    <p className="text-xs text-blue-500 dark:text-blue-400">
                      Bundled with product ID: {product.bundleWith}
                    </p>
                  )}
                </div>
                {isSuperAdmin && (
                  <div className="flex gap-2 mt-2">
                    <Link
                      href={`/dashboard/products/edit/${product._id}`}
                      className="text-sm bg-gray-300 dark:bg-gray-700 px-3 py-1 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
