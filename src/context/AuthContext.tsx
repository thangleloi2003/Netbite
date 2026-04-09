import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';


type User = {
  id: string;
  username: string;
  role: 'admin' | 'customer';
  name: string;
};

type AuthContextType = {
  user: User | null;
  login: (u: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('netbite_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const login = (u: User) => {
    setUser(u);
    localStorage.setItem('netbite_user', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('netbite_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
