import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import authService from '../shared/services/authService';

interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_STORAGE_KEY = 'project-management-auth';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedSession = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedSession) {
      const parsed = JSON.parse(savedSession) as { user: User };
      setUser(parsed.user);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const session = await authService.login(credentials);
      setUser(session.user);
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      navigate('/', { replace: true });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    navigate('/login', { replace: true });
  };

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(user),
      user,
      login,
      logout,
      isLoading,
      error
    }),
    [user, isLoading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }

  return context;
};