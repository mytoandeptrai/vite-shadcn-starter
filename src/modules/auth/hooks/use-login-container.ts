import { ROUTES } from '@/constant';
import { useSessionStore } from '@/stores/use-session-store';
import { useRouter } from '@tanstack/react-router';

export const useLoginContainer = () => {
  const { setAccessToken, setRefreshToken } = useSessionStore();
  const router = useRouter();

  const handleSubmit = () => {
    const accessToken = 'mock_access';
    const refreshToken = 'mock_refresh';
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    router.navigate({ to: ROUTES.DASHBOARD });
  };

  return {
    isLoading: false,
    handleSubmit,
  };
};
