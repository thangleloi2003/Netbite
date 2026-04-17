import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productApi, categoryApi } from "../services/api";
import type { Category, Product } from "../types";
import { useAdmin } from "../context/AdminContext";

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
  toppings: [],
  relatedIds: [],
  comboItems: [],
};

export function useProductForm({ productId, onSuccess }: UseProductFormProps = {}) {
  const navigate = useNavigate();
  const { refreshData } = useAdmin();
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
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
    
    // Only require image if not a combo
    if (formData.category !== "combo") {
      if (!formData.image || !formData.image.startsWith("http")) {
        setError("Vui lòng nhập link hình ảnh hợp lệ.");
        return false;
      }
    }

    if (formData.originalPrice && Number(formData.originalPrice) <= Number(formData.price)) {
      setError("Giá gốc phải lớn hơn giá bán hiện tại.");
      return false;
    }

    // Validate combo items if category is combo
    if (formData.category === "combo") {
      if (!formData.comboItems || formData.comboItems.length === 0) {
        setError("Combo phải có ít nhất một sản phẩm.");
        return false;
      }
    }

    return true;
  };

  useEffect(() => {
    categoryApi.getAll().then(setCategories).catch(console.error);
    productApi.getAll().then(setAllProducts).catch(console.error);

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
      // Clean up comboItems if not a combo
      const dataToSubmit = { ...formData };
      if (dataToSubmit.category !== "combo") {
        delete dataToSubmit.comboItems;
        // Provide a default description for non-combo products if empty
        if (!dataToSubmit.description) {
          dataToSubmit.description = `${dataToSubmit.name} - Sản phẩm chất lượng từ NetBite.`;
        }
      } else {
        // Set default generic image for combo
        if (dataToSubmit.category === "combo") {
          dataToSubmit.image = "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop";
          // ALWAYS auto-generate description for combos to keep them consistent
          const itemNames = (dataToSubmit.comboItems || [])
            .map(item => allProducts.find(p => p.id === item.productId)?.name)
            .filter(Boolean)
            .join(", ");
          dataToSubmit.description = `Combo bao gồm: ${itemNames || "nhiều món hấp dẫn"}.`;
        }
        // Combo doesn't need toppings
        dataToSubmit.toppings = [];
      }

      if (productId) {
        await productApi.update(productId, dataToSubmit);
      } else {
        const nextId = "p_" + Math.random().toString(36).substr(2, 9);
        const productToCreate = {
          id: nextId,
          ...dataToSubmit,
        } as Product;
        await productApi.create(productToCreate);
      }
      
      await refreshData();
      setSuccess(true);
      
      if (onSuccess) {
        onSuccess();
      } else {
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

  const addComboItem = (productId: string) => {
    if (!productId) return;
    setFormData((prev) => {
      const currentItems = prev.comboItems || [];
      if (currentItems.find(item => item.productId === productId)) return prev;
      
      const updatedItems = [...currentItems, { productId, quantity: 1 }];
      
      // Update originalPrice based on total of items
      const newOriginalPrice = updatedItems.reduce((sum, item) => {
        const p = allProducts.find(prod => prod.id === item.productId);
        return sum + (p ? p.price * item.quantity : 0);
      }, 0);

      return { ...prev, comboItems: updatedItems, originalPrice: newOriginalPrice };
    });
  };

  const removeComboItem = (productId: string) => {
    setFormData((prev) => {
      const updatedItems = (prev.comboItems || []).filter(item => item.productId !== productId);
      
      // Recalculate originalPrice
      const newOriginalPrice = updatedItems.reduce((sum, item) => {
        const p = allProducts.find(prod => prod.id === item.productId);
        return sum + (p ? p.price * item.quantity : 0);
      }, 0);

      return { ...prev, comboItems: updatedItems, originalPrice: newOriginalPrice > 0 ? newOriginalPrice : null };
    });
  };

  const updateComboItemQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setFormData((prev) => {
      const updatedItems = (prev.comboItems || []).map(item => 
        item.productId === productId ? { ...item, quantity } : item
      );

      // Recalculate originalPrice
      const newOriginalPrice = updatedItems.reduce((sum, item) => {
        const p = allProducts.find(prod => prod.id === item.productId);
        return sum + (p ? p.price * item.quantity : 0);
      }, 0);

      return { ...prev, comboItems: updatedItems, originalPrice: newOriginalPrice };
    });
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

  const setDiscount = (percentage: number) => {
    if (!formData.originalPrice || percentage < 0 || percentage > 100) return;
    const newPrice = Math.round(formData.originalPrice * (1 - percentage / 100));
    setFormData(prev => ({ ...prev, price: newPrice }));
  };

  const discountPercentage = formData.originalPrice && formData.price && formData.originalPrice > formData.price
    ? Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100)
    : 0;

  return {
    formData,
    categories,
    allProducts,
    loading,
    initialLoading,
    error,
    success,
    handleChange,
    handleSubmit,
    addComboItem,
    removeComboItem,
    updateComboItemQuantity,
    addTopping,
    removeTopping,
    updateTopping,
    addToppingOption,
    removeToppingOption,
    setDiscount,
    discountPercentage,
  };
}
