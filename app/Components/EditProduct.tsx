"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProductById, updateProduct } from "@/app/APILayer/productlist";

const EditProduct = () => {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const result = await getProductById(Number(id));
        setProduct(result.Products);
      } catch (error: any) {
        setError(error.message);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    const formData = new FormData();
    formData.append("image", product.image);
    formData.append("gif", product.gif);
    formData.append("content", product.content);
    formData.append("is_active", product.is_active ? "true" : "false");

    try {
      await updateProduct(Number(id), formData);
      alert("Product updated successfully");
      router.push("/admin/productList");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow">
      <h2 className="text-xl font-bold">Edit Product</h2>

      <input
        type="file"
        onChange={(e) => setProduct({ ...product, image: e.target.files?.[0] })}
        required
      />

      <input
        type="file"
        onChange={(e) => setProduct({ ...product, gif: e.target.files?.[0] })}
        required
      />

      <textarea
        value={product?.content || ""}
        onChange={(e) => setProduct({ ...product, content: e.target.value })}
        className="w-full border p-2 rounded"
        required
      />

      <select
        value={product?.is_active ? "true" : "false"}
        onChange={(e) => setProduct({ ...product, is_active: e.target.value === "true" })}
      >
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>

      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Save
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
};

export default EditProduct;
