"use client";

import { useState } from "react";
import { createProduct } from "@/app/APILayer/productlist";
import { useRouter } from "next/navigation";

const AddProduct = () => {
  const [product, setProduct] = useState({
    image: null as File | null,
    gif: null as File | null,
    content: "",
    is_active: false,
  });
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    if (product.image) formData.append("image", product.image);
    if (product.gif) formData.append("gif", product.gif);
    formData.append("content", product.content);
    formData.append("is_active", String(product.is_active));

    try {
      await createProduct(formData);
      alert("Product added successfully");
      router.push("/admin/ProductList");
    } catch (error: any) {
      setError(error.message);
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg"
      >
        <h1 className="text-2xl font-semibold mb-4 text-center">Add Product</h1>

        <div>
          <label className="block font-medium mb-2">Upload Image:</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setProduct({...product, image: e.target.files?.[0] || null})}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mt-4">
          <label className="block font-medium mb-2">Upload Gif:</label>
          <input
            type="file"
            accept="image/gif"
            onChange={(e) => setProduct({...product, gif: e.target.files?.[0] || null})}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mt-4">
          <label className="block font-medium mb-2">Content:</label>
          <textarea
            value={product.content}
            onChange={(e) => setProduct({...product, content: e.target.value})}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            id="is_active"
            checked={product.is_active}
            onChange={(e) => setProduct({...product, is_active: e.target.checked})}
            className="mr-2"
          />
          <label htmlFor="is_active" className="font-medium">Active</label>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Add Product
        </button>
      </form>
      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
    </div>
  );
};

export default AddProduct;
