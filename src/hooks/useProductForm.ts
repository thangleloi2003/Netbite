import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productApi, categoryApi } from "../services/api";
import type { Category, Product } from "../types";

interface UseProductFormProps {
  productId?: string;
  onSuccess?: () => void;
}

const initialFormState: Omit<Product, "id"> = {
  name: "",
  price: 0,
  originalPrice: null,
  image: "",
  images: [],
  category: "",
  description: "",
  tags: [],
  rating: 5,
  reviewCount: 0,
  calories: 0,
  protein: 0,
  fat: 0,
  badges: [],
  toppings: [],
  relatedIds: [],
};

export function useProductForm({ productId, onSuccess }: UseProductFormProps = {}) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!productId);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Product, "id"> | Partial<Product>>(initialFormState);

  useEffect(() => {
    categoryApi.getAll().then(setCategories).catch(console.error);

    if (productId) {
      setInitialLoading(true);
      productApi.getById(productId)
        .then((product) => {
          setFormData(product);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load product details.");
        })
        .finally(() => {
          setInitialLoading(false);
        });
    }
  }, [productId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === "isBestSeller") {
        setFormData((prev) => {
          const currentTags = prev.tags || [];
          const updatedTags = checked 
            ? [...currentTags.filter(t => t !== "bestseller"), "bestseller"]
            : currentTags.filter(t => t !== "bestseller");
          return { ...prev, tags: updatedTags };
        });
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "originalPrice" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (productId) {
        await productApi.update(productId, formData);
      } else {
        const productToCreate = {
          ...formData,
          id: Date.now().toString(),
        } as Product;
        await productApi.create(productToCreate);
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/admin/products");
      }
    } catch (err) {
      setError(`Failed to ${productId ? "update" : "create"} product. Please try again.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    categories,
    loading,
    initialLoading,
    error,
    handleChange,
    handleSubmit,
  };
}
