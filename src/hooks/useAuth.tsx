import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then((data) => {
          setUser(data.user);
          setIsAdmin(data.isAdmin);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
          setIsAdmin(false);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const data = await api.post('/auth/signin', { email, password });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setIsAdmin(data.isAdmin);
      return { error: null };
    } catch (err: any) {
      return { error: new Error(err.message || 'Failed to sign in') };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await api.post('/auth/signup', { email, password });
      return { error: null };
    } catch (err: any) {
      return { error: new Error(err.message || 'Failed to sign up') };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
