import { createContext, useState, useEffect, type ReactNode } from 'react';
import { type User } from '../types';
import { authApi } from '../services/api';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (u: User, token: string) => void;
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
    const validateSession = async () => {
      try {
        const validatedUser = await authApi.verifyToken();
        if (validatedUser) {
          setUser(validatedUser);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error("Session validation failed", e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, []);

  const login = (u: User, token: string) => {
    setUser(u);
    // Token is already stored in localStorage by authApi.login
  };

  const logout = () => {
    setUser(null);
    authApi.logout();
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
