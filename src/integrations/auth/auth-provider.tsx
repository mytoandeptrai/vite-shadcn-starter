import LoadingFluid from '@/components/shared/loading-fluid';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type AuthContextState = {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string) => {
    // TODO: Implement http login logic
    // eslint-disable-next-line no-console
    console.log(email, password);
  };

  const logout = async () => {
    // TODO: Implement http logout logic
  };

  useEffect(() => {
    const verifySession = async () => {
      // TODO: Implement http verify session logic
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsLoading(false);
    };
    verifySession();
  }, []);

  const contextValue: AuthContextState = { logout, login, isAuthenticated: false };

  if (isLoading) {
    return <LoadingFluid />;
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}