"use client";

import { useEffect, useState } from "react";
import { getAllProducts } from "@/app/APILayer/productlist";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  image: string;
  gif: string;
  content: string;
  is_active: boolean;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  console.log("this si the procut type",typeof products);
  console.log("the above is the products type")
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await getAllProducts();
        setProducts(result.Products.products);
        console.log("this is the product type",typeof result.Product);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading products...</div>;


  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Product List</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => router.push("/admin/addProducts")}
      >
        Add Product
      </button>
      {products.map((product) => (
        <div key={product.id} className="border p-4 mb-2 rounded shadow">
          <img src={product.image} alt="Product" className="w-20 h-20 object-cover" />
          <img src={product.gif} alt="GIF" className="w-20 h-20 object-cover" />
          <p>{product.content}</p>
          <button
            onClick={() => router.push(`/admin/editProduct/${product.id}`)}
            className="bg-green-500 text-white px-4 py-2 rounded mt-2"
          >
            Edit
          </button>
        </div>
      ))}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default ProductList;
