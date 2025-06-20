'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import 'animate.css';

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export default function CatalogueSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);

  const contactNumber = '+2348055211465';

  return (
    <section
      id="catalogue"
      className="py-16 px-4 bg-gray-100 dark:bg-gray-800 animate__animated animate__fadeIn"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-gray-900 dark:text-white">
          Our Catalogue
        </h2>

        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-300">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No products available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden border dark:border-gray-700 flex flex-col"
              >
                {product.imageUrl && (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={500}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {formatPrice(product.price)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      In Stock: {product.quantity}
                    </p>
                  </div>
                  <a
                    href={`https://wa.me/${contactNumber.replace(
                      '+',
                      ''
                    )}?text=Hi%2C%20I'm%20interested%20in%20buying%20${encodeURIComponent(
                      product.name
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded text-center transition"
                  >
                    Buy Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
