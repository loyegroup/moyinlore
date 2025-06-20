// app/dashboard/products/edit/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function EditProductPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [form, setForm] = useState({
    name: "",
    imageUrl: "",
    price: "",
    quantity: "",
    category: "",
    bundleWith: "",
    discountedPrice: "",
    allowFractional: false,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      setForm({
        ...data,
        price: data.price.toString(),
        quantity: data.quantity.toString(),
        discountedPrice: data.discountedPrice?.toString() || "",
        bundleWith: data.bundleWith || "",
      });
    };

    if (id) fetchProduct();
  }, [id]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session || session.user.role !== "superAdmin") {
    return <p className="text-red-500">Access denied.</p>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: parseFloat(form.price),
      quantity: parseFloat(form.quantity),
      discountedPrice: form.discountedPrice ? parseFloat(form.discountedPrice) : null,
    };

    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    router.push("/dashboard/products");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
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
          <span>Allow fractional sales</span>
        </label>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update Product</button>
      </form>
    </div>
  );
// This code defines a page for editing a product in a Next.js application.
// It fetches the product data based on the ID from the URL, allows the user to update the product details, and submits the changes to the server.
}