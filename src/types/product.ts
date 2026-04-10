export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number | null;
  image: string;
  images: string[];
  category: string;
  description: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  calories: number;
  protein: number;
  fat: number;
  badges: { icon: string; label: string }[];
  toppings: {
    id: string;
    label: string;
    price: number;
    icon: string;
    type: "level" | "binary" | "quantifiable";
    options?: string[];
  }[];
  relatedIds: string[];
}

