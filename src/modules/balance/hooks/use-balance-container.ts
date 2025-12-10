import { useTranslation } from '@/integrations/i18n';
import { useCallback, useState } from 'react';

export const useBalanceContainer = () => {
  const {t} = useTranslation('balance-page');
  /** TODO: Request API here */
  const balance = 1000;
  const incomingBalance = 250;

  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const onCloseDialog = useCallback(() => {
    setIsOpenDialog(false);
  }, []);

  const onOpenDialog = useCallback(() => {
    setIsOpenDialog(true);
  }, []);

  return {
    t,
    balance,
    incomingBalance,
    isOpenDialog,
    onCloseDialog,
    onOpenDialog,
  };
};