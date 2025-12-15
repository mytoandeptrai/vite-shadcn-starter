import { useGetUserInfo, useSignout, type IUserInfo } from "@/apis/auth";
import LoadingFluid from "@/components/shared/loading-fluid";
import { ROUTES } from "@/constant";
import { router } from "@/main";
import { useSessionStore } from "@/stores/use-session-store";
import { createContext, useContext, type ReactNode } from "react";
import { getContext } from "../tanstack-query/root-provider";
import { toast } from "sonner";
import { useTranslation } from "../i18n";

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

  const signoutMutation = useSignout();

  const { data, isLoading, refetch } = useGetUserInfo({
    enabled: !!payload.accessToken,
  });
  const userData = data?.data;

  const onRefetch = async () => {
    await refetch();
  };

  const onSignout = async () => {
    if (signoutMutation.isPending || !payload.refreshToken) return;
    // await signoutMutation.mutateAsync({
    //   refreshToken: payload.refreshToken!,
    // });
    toast.success(t('messages.signout-success', { ns: 'common' }));
    queryClient.cancelQueries({});
    queryClient.removeQueries({});
    payload.reset();
    router.navigate({
      to: ROUTES.LOGIN,
      replace: true,
    });
  };

  const contextValue: AuthContextState = {
    isAuthenticating: isLoading,
    isAuthenticated: !!payload.accessToken && !isLoading && !!userData,
    user: userData,
    onRefetch,
    onSignout,
  };

  if (isLoading) {
    return <LoadingFluid />;
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
