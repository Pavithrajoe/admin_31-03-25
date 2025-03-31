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
    <div className="p-4 max-w-md mx-auto grid place-items-center ">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1>Add Product</h1>
        <div>
          
          <label className="block mb-2">Upload Image:</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setProduct({...product, image: e.target.files?.[0] || null})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Upload Gif:</label>
          <input
            type="file"
            accept="image/gif"
            onChange={(e) => setProduct({...product, gif: e.target.files?.[0] || null})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Content:</label>
          <textarea
            value={product.content}
            onChange={(e) => setProduct({...product, content: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_active"
            checked={product.is_active}
            onChange={(e) => setProduct({...product, is_active: e.target.checked})}
            className="mr-2"
          />
          <label htmlFor="is_active">Active</label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
        Add Product 
        </button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default AddProduct;