import { useState, useEffect, useMemo } from "react";
import { productApi } from "../services/api";
import type { Product } from "../types";

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productApi.getAll();
      setProducts(data);
    } catch (err) {
      setError("Failed to fetch products");
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await productApi.delete(id);
        setProducts(prev => prev.filter((p) => p.id !== id));
        return true;
      } catch (err) {
        setError("Failed to delete product");
        console.error("Failed to delete product:", err);
        return false;
      }
    }
    return false;
  };

  const toggleBestSeller = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return false;

    const isBestSeller = product.tags.includes("bestseller");
    const updatedTags = isBestSeller 
      ? product.tags.filter(tag => tag !== "bestseller")
      : [...product.tags, "bestseller"];

    try {
      const updatedProduct = await productApi.update(id, { tags: updatedTags });
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      return true;
    } catch (err) {
      setError("Failed to update best seller status");
      console.error("Failed to update best seller status:", err);
      return false;
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (filter === "all") return true;
      return p.category === filter;
    });
  }, [products, filter]);

  return {
    products,
    filteredProducts,
    loading,
    error,
    filter,
    setFilter,
    refreshProducts: fetchProducts,
    deleteProduct,
    toggleBestSeller,
  };
}
