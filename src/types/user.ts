export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: "admin" | "customer";
  avatar?: string;
  password?: string;
}

