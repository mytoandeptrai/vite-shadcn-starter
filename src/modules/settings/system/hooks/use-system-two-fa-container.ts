import { KEYS, useDisableTwoFa } from '@/apis/auth';
import { useAuthContext } from '@/integrations/auth/auth-provider';
import { useDialogContext } from '@/integrations/dialog/dialog-provider';
import { useTranslation } from '@/integrations/i18n';
import { getContext } from '@/integrations/tanstack-query/root-provider';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export const useSystemTwoFaContainer = () => {
  const { t } = useTranslation('settings-page');

  const { onOpenTwoFAModal, onCloseModal } = useDialogContext();
  const { user, onRefetch } = useAuthContext();
  const { queryClient } = getContext();
  const disableTwoFaMutation = useDisableTwoFa();

  const isEnabledTwoFa = user?.twoFAEnabled ?? false;
  const isLoading = disableTwoFaMutation.isPending;

  const [isOpenSteps, setIsOpenSteps] = useState(false);
  const [isRemovedTwoFa, setIsRemovedTwoFa] = useState(false);

  const onBack = useCallback(() => {
    setIsOpenSteps(false);
  }, []);

  const onOpenSteps = useCallback(() => {
    setIsOpenSteps(true);
  }, []);

  const onResetTwoFa = useCallback(() => {
    setIsRemovedTwoFa(false);
  }, []);

  const onClick = () => {
    if (isEnabledTwoFa) {
      setIsRemovedTwoFa(true);
      return;
    }
    setIsOpenSteps(true);
  };

  const onSubmitRemoveTwoFa = useCallback(
    async (password: string) => {
      onOpenTwoFAModal({
        forceOpen: true,
        skipInitVerification: true,
        closeOnSubmit: false,
        cb: async (code) => {
          await disableTwoFaMutation.mutateAsync({ password, twoFACode: code! });
          await queryClient.invalidateQueries({ queryKey: [KEYS.INFO] });
          onRefetch();
          toast.success(t('messages.two-fa-disabled-success', { ns: 'common' }));
          setIsRemovedTwoFa(false);
          onCloseModal();
        },
      });
    },
    [disableTwoFaMutation, onRefetch, queryClient.invalidateQueries, t, onCloseModal, onOpenTwoFAModal]
  );

  return {
    t,
    isEnabledTwoFa,
    isOpenSteps,
    isRemovedTwoFa,
    isLoading,
    onBack,
    onOpenSteps,
    onResetTwoFa,
    onClick,
    onSubmitRemoveTwoFa,
  };
};
