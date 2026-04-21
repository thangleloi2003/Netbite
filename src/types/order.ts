export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  toppings?: {
    id: string;
    label: string;
    price: number;
  }[];
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "delivered" | "cancelled";
  date: string;
  machineNumber: string;
  note?: string;
}

