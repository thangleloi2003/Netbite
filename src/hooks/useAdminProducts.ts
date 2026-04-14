import { useState, useEffect, useMemo } from "react";
import { useAdmin } from "../context/AdminContext";

export function useAdminProducts() {
  const { 
    products, 
    categories, 
    loading, 
    error, 
    deleteProduct: contextDeleteProduct,
    updateProduct: contextUpdateProduct,
    refreshData 
  } = useAdmin();
  
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setPage(1);
  }, [filter, search]);

  const deleteProduct = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await contextDeleteProduct(id);
        return true;
      } catch (err) {
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
      await contextUpdateProduct(id, { tags: updatedTags });
      return true;
    } catch (err) {
      console.error("Failed to update best seller status:", err);
      return false;
    }
  };

  const toggleHot = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return false;

    const isHot = product.tags.includes("hot");
    const updatedTags = isHot 
      ? product.tags.filter(tag => tag !== "hot")
      : [...product.tags, "hot"];

    try {
      await contextUpdateProduct(id, { tags: updatedTags });
      return true;
    } catch (err) {
      console.error("Failed to update hot status:", err);
      return false;
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesFilter = filter === "all" || p.category === filter;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                            p.description.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [products, filter, search]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, page]);

  return {
    products,
    categories,
    filteredProducts,
    paginatedProducts,
    loading,
    error,
    filter,
    setFilter,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    refreshProducts: refreshData,
    deleteProduct,
    toggleBestSeller,
    toggleHot,
  };
}
