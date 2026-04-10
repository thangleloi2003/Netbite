import { createContext, useState, useEffect, type ReactNode } from 'react';
import { type User } from '../types';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (u: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  isAdmin: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem('netbite_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse user from sessionStorage", e);
        sessionStorage.removeItem('netbite_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (u: User) => {
    setUser(u);
    sessionStorage.setItem('netbite_user', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('netbite_user');
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
