import { useGetApiKeys } from '@/apis/api-keys';
import { ROUTES } from '@/constant';
import { useAuthContext } from '@/integrations/auth/auth-provider';
import { useTranslation } from '@/integrations/i18n';
import { Link } from '@tanstack/react-router';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export const useDeveloperApiKeysContainer = () => {
  const { t } = useTranslation('developer-page');
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const { user } = useAuthContext();
  const isEnabledTwoFa = user?.twoFAEnabled ?? false;

  const { data, isLoading, refetch } = useGetApiKeys();
  const apiKeys = data?.data?.keys ?? [];
  const publicKey = apiKeys[0]?.Key ?? '';
  const secretKey = apiKeys[1]?.Key ?? '';
  const createdAt = apiKeys[0]?.UpdatedAt ?? '';

  const onCloseDialog = useCallback(() => {
    setIsOpenDialog(false);
  }, []);

  const onOpenDialog = useCallback(() => {
    if (!isEnabledTwoFa) {
      toast.error(
        <Link to={ROUTES.SYSTEM} className='hover:underline'>
          {t('messages.require-enable-two-fa', { ns: 'common' })}
        </Link>
      );
      return;
    }
    setIsOpenDialog(true);
  }, [isEnabledTwoFa, t]);

  const onSuccess = useCallback(() => {
    refetch();
    onCloseDialog();
  }, [onCloseDialog, refetch]);

  return {
    t,
    isLoading,
    publicKey,
    secretKey,
    isOpenDialog,
    createdAt,
    onCloseDialog,
    onOpenDialog,
    onSuccess,
  };
};
