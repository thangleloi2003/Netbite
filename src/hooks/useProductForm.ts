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
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<Omit<Product, "id"> | Partial<Product>>(initialFormState);

  const validateForm = () => {
    if (!formData.name || formData.name.trim().length < 3) {
      setError("Tên sản phẩm phải có ít nhất 3 ký tự.");
      return false;
    }
    const priceVal = Number(formData.price);
    if (formData.price === null || isNaN(priceVal) || priceVal <= 0) {
      setError("Giá sản phẩm phải lớn hơn 0.");
      return false;
    }
    if (!formData.category) {
      setError("Vui lòng chọn danh mục.");
      return false;
    }
    if (!formData.image || !formData.image.startsWith("http")) {
      setError("Vui lòng nhập link hình ảnh hợp lệ.");
      return false;
    }
    return true;
  };

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
      if (name === "bestseller" || name === "hot") {
        setFormData((prev) => {
          const currentTags = prev.tags || [];
          const updatedTags = checked 
            ? [...currentTags.filter(t => t !== name), name]
            : currentTags.filter(t => t !== name);
          return { ...prev, tags: updatedTags };
        });
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "originalPrice" ? (value === "" ? null : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (productId) {
        await productApi.update(productId, formData);
      } else {
        
        const nextId = "p_" + Math.random().toString(36).substr(2, 9);

        const productToCreate = {
          id: nextId,
          ...formData,
        } as Product;
        await productApi.create(productToCreate);
      }
      
      setSuccess(true);
      
      if (onSuccess) {
        onSuccess();
      } else {
        // Delay navigation to show success state
        setTimeout(() => {
          navigate("/admin/products");
        }, 1500);
      }
    } catch (err) {
      setError(`Lỗi: Không thể ${productId ? "cập nhật" : "tạo"} sản phẩm. Vui lòng thử lại.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTopping = () => {
    setFormData((prev) => ({
      ...prev,
      toppings: [
        ...(prev.toppings || []),
        {
          id: `t${Date.now()}`,
          label: "",
          price: 0,
          icon: "restaurant",
          type: "quantifiable",
          options: [],
        },
      ],
    }));
  };

  const removeTopping = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      toppings: (prev.toppings || []).filter((_, i) => i !== index),
    }));
  };

  const updateTopping = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const newToppings = [...(prev.toppings || [])];
      newToppings[index] = { ...newToppings[index], [field]: value };
      return { ...prev, toppings: newToppings };
    });
  };

  const addToppingOption = (index: number, option: string) => {
    if (!option.trim()) return;
    setFormData((prev) => {
      const newToppings = [...(prev.toppings || [])];
      const currentOptions = newToppings[index].options || [];
      newToppings[index] = { 
        ...newToppings[index], 
        options: [...currentOptions, option.trim()] 
      };
      return { ...prev, toppings: newToppings };
    });
  };

  const removeToppingOption = (index: number, optionIndex: number) => {
    setFormData((prev) => {
      const newToppings = [...(prev.toppings || [])];
      const currentOptions = newToppings[index].options || [];
      newToppings[index] = { 
        ...newToppings[index], 
        options: currentOptions.filter((_, i) => i !== optionIndex) 
      };
      return { ...prev, toppings: newToppings };
    });
  };

  return {
    formData,
    categories,
    loading,
    initialLoading,
    error,
    success,
    handleChange,
    handleSubmit,
    addTopping,
    removeTopping,
    updateTopping,
    addToppingOption,
    removeToppingOption,
  };
}
