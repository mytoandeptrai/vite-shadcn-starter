import { useVerify } from '@/apis/auth';
import { ROUTES } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import type { BaseResponseType } from '@/types';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { toast } from 'sonner';

type Props = {
  token?: string;
};

export const useActiveContainer = (props: Props) => {
  const { token } = props;
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  const verifyMutation = useVerify();

  useEffect(() => {
    (async () => {
      try {
        await verifyMutation.mutateAsync({ token: token! });
        toast.success(t('messages.active-success', { ns: 'common' }));
        navigate({
          to: ROUTES.LOGIN,
        });
      } catch (e) {
        const error = e as unknown as BaseResponseType<{ email: string }>;
        if (error?.message === 'ACTIVE_CODE_EXPIRED') {
          navigate({
            to: ROUTES.LINK_EXPIRED,
            search: {
              email: error?.data?.email,
            },
          });
          return;
        }

        navigate({
          to: ROUTES.REGISTER,
        });
      }
    })();
  }, [token, navigate, t]);

  return {};
};
