import type { IUserInfo } from '@/apis/auth';
import LoadingFluid from '@/components/shared/loading-fluid';
import { ROUTES } from '@/constant';
import { router } from '@/main';
import { useSessionStore } from '@/stores/use-session-store';
import { createContext, useContext, type ReactNode } from 'react';
import { toast } from 'sonner';
import { useTranslation } from '../i18n';
import { getContext } from '../tanstack-query/root-provider';

export type AuthContextState = {
  isAuthenticating: boolean;
  isAuthenticated: boolean;
  user?: IUserInfo;
  onRefetch: () => Promise<void>;
  onSignout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation('common');
  const payload = useSessionStore();
  const { queryClient } = getContext();

  const userData = undefined;

  const onRefetch = async () => {
    /** TODO: Implement */
  };

  const onSignout = async () => {
    toast.success(t('messages.signout-success', { ns: 'common' }));
    queryClient.cancelQueries({});
    queryClient.removeQueries({});
    queryClient.clear();
    payload.reset();
    router.navigate({
      to: ROUTES.HOME,
    });
  };

  const contextValue: AuthContextState = {
    isAuthenticating: false,
    isAuthenticated: !!payload.accessToken,
    user: userData,
    onRefetch,
    onSignout,
  };

  if (contextValue.isAuthenticating) {
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
