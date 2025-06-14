"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

const initialProducts: Product[] = [
  { id: "1", name: "Laptop", price: 2500, quantity: 10, category: "Electronics" },
  { id: "2", name: "Desk Chair", price: 150, quantity: 5, category: "Furniture" },
  { id: "3", name: "Bookshelf", price: 80, quantity: 3, category: "Furniture" },
  { id: "4", name: "Mouse", price: 25, quantity: 20, category: "Electronics" },
];

export default function ProductPage() {
  const { data: session, status } = useSession();

  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedProduct, setEditedProduct] = useState<Partial<Product>>({});
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});

  useEffect(() => {
    setProducts(initialProducts);
  }, []);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p className="text-red-500">You must be logged in to manage products.</p>;

  const isAdmin = session.user.role === "admin" || session.user.role === "superAdmin";
  const isSuperAdmin = session.user.role === "superAdmin";

  const categories = ["all", ...new Set(products.map((p) => p.category))];

  const filtered = products.filter((p) => {
    const matchesCategory = filterCategory === "all" || p.category === filterCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatNaira = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditedProduct({ ...product });
  };

  const handleSave = () => {
    setProducts((prev) =>
      prev.map((p) => (p.id === editingId ? { ...p, ...editedProduct } : p))
    );
    setEditingId(null);
    setEditedProduct({});
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleAdd = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.quantity) return;
    const newEntry = {
      ...newProduct,
      id: Date.now().toString(),
    } as Product;
    setProducts([newEntry, ...products]);
    setNewProduct({});
  };

  return (
    <motion.div
      className="max-w-5xl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-bold mb-6">Manage Products</h1>

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
              {cat === "all" ? "All Categories" : cat}
            </option>
          ))}
        </select>
      </div>

      {isAdmin && (
        <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-900 mb-6 space-y-2">
          <h2 className="text-lg font-semibold mb-2">Add New Product</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <input type="text" placeholder="Product Name" value={newProduct.name || ''} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="input" />
            <input type="number" placeholder="Price" value={newProduct.price || ''} onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })} className="input" />
            <input type="number" placeholder="Quantity" value={newProduct.quantity || ''} onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })} className="input" />
            <input type="text" placeholder="Category" value={newProduct.category || ''} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="input" />
          </div>
          <button onClick={handleAdd} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm">Add Product</button>
        </div>
      )}

      {categories.filter((cat) => cat !== "all").map((cat) => (
        <div key={cat} className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{cat}</h2>
          <div className="space-y-3">
            {filtered.filter((p) => p.category === cat).map((product) => (
              editingId === product.id ? (
                <div key={product.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-sm space-y-2">
                  <input value={editedProduct.name || ''} onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })} className="input" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" value={editedProduct.price ?? 0} onChange={(e) => setEditedProduct({ ...editedProduct, price: Number(e.target.value) })} className="input" placeholder="Price" />
                    <input type="number" value={editedProduct.quantity ?? 0} onChange={(e) => setEditedProduct({ ...editedProduct, quantity: Number(e.target.value) })} className="input" placeholder="Quantity" />
                  </div>
                  <input value={editedProduct.category || ''} onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })} className="input" />
                  <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 mt-2 rounded hover:bg-blue-700 transition text-sm">Save</button>
                </div>
              ) : (
                <div key={product.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-sm flex justify-between items-center">
                  <div>
                    <h2 className="font-semibold text-lg text-gray-900 dark:text-white">{product.name}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{formatNaira(product.price)} • {product.quantity} in stock</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Category: {product.category}</p>
                  </div>
                  <div className="flex gap-2">
                    {isAdmin && (
                      <button onClick={() => handleEdit(product)} className="text-sm bg-gray-300 dark:bg-gray-700 px-3 py-1 rounded hover:bg-gray-400 dark:hover:bg-gray-600">Edit</button>
                    )}
                    {isSuperAdmin && (
                      <button onClick={() => handleDelete(product.id)} className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Delete</button>
                    )}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
// This component allows admins to manage products, including adding, editing, and deleting products.
// It uses Framer Motion for animations and NextAuth for session management.
