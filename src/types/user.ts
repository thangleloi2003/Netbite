export interface User {
  id: string;
  username: string;
  name: string;
  role: "admin" | "customer";
  status: "active" | "inactive";
  machineId?: string;
  isGuest?: boolean;
  password?: string;
}

