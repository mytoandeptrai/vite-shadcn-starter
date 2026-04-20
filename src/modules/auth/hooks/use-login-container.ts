import { ROUTES } from '@/constant';
import { useSessionStore } from '@/stores/use-session-store';
import { useRouter } from '@tanstack/react-router';

export const useLoginContainer = () => {
  const { setAccessToken, setRefreshToken } = useSessionStore();
  const router = useRouter();

  const handleSubmit = () => {
    setAccessToken('mock_access');
    setRefreshToken('mock_refresh');
    router.navigate({ to: ROUTES.DASHBOARD });
  };

  return {
    isLoading: false,
    handleSubmit,
  };
};
