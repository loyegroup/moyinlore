'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from 'next-themes';

const mockProducts = [
  {
    id: 1,
    name: 'Laptop',
    price: 2500,
    category: 'Electronics',
    image: '/laptop.jpg',
  },
  {
    id: 2,
    name: 'Desk Chair',
    price: 150,
    category: 'Furniture',
    image: '/chair.jpg',
  },
  {
    id: 3,
    name: 'LED Monitor',
    price: 400,
    category: 'Electronics',
    image: '/monitor.jpg',
  },
  {
    id: 4,
    name: 'Bookshelf',
    price: 80,
    category: 'Furniture',
    image: '/bookshelf.jpg',
  },
];

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const filtered = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Top row: Admin login + Dark mode toggle */}
        <div className="flex justify-between items-center mb-6">
          <a
            href="/login"
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md shadow hover:scale-105 transition"
          >
            Admin Login
          </a>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-sm px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>

        {/* Hero heading */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Explore Our Catalog
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Find the best equipment and furniture for your workspace
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <input
            type="text"
            placeholder="Search products..."
            className="w-full max-w-lg mx-auto block p-3 mb-10 border border-gray-300 rounded-xl shadow-md dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </motion.div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filtered.map((product, index) => (
            <motion.div
              key={product.id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition transform hover:scale-[1.015]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.name}
                  width={500}
                  height={300}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {product.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">${product.price}</p>
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  {product.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No results */}
        {filtered.length === 0 && (
          <motion.p
            className="mt-10 text-gray-500 dark:text-gray-400 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No products found.
          </motion.p>
        )}
      </div>
    </main>
  );
}
