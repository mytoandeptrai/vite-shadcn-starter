import { useTranslation } from '@/integrations/i18n';
import { useCallback, useState } from 'react';

export const useSystemTwoFaContainer = () => {
  const { t } = useTranslation('settings-page');
  const isEnabledTwoFa = false;
  const isLoading = false;

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

  const onSubmitRemoveTwoFa = useCallback(() => {
    /** Todo: Call API */
    setIsRemovedTwoFa(false);
  }, []);

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