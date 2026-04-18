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
    const validateSession = async (isBackground = false) => {
      try {
        if (!isBackground) setLoading(true);
        const validatedUser = await authApi.verifyToken();
        if (validatedUser) {
          // If the user's status has changed to inactive, they will be logged out by verifyToken logic
          setUser(validatedUser);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error("Session validation failed:", e);
        if (!isBackground) setUser(null);
      } finally {
        if (!isBackground) setLoading(false);
      }
    };

    validateSession();

    // Set up background polling to detect real-time status changes (e.g., admin deactivating account)
    // Only poll if a user is logged in
    const interval = setInterval(() => {
      if (localStorage.getItem("netbite_auth_token")) {
        validateSession(true);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
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
