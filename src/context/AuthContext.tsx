import { createContext, useState, useEffect, type ReactNode } from 'react';
import { type User } from '../types';
import { authApi } from '../services/api';

type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  guestLogin: () => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      try {
        const validatedUser = await authApi.verifyToken();
        if (validatedUser) {
          console.log("Session validated:", validatedUser.username, validatedUser.role);
          setUser(validatedUser);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error("Session validation failed:", e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, []);

  const login = (u: User) => {
    setUser(u);
    // Token is already stored in localStorage by authApi.login
  };

  const guestLogin = async () => {
    try {
      const { user: guestUser } = await authApi.guestAccess();
      setUser(guestUser);
    } catch (err) {
      console.error("Guest login failed:", err);
      throw err;
    }
  };

  const logout = async () => {
    const userId = user?.id;
    setUser(null);
    await authApi.logout(userId);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, guestLogin, logout, loading, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
