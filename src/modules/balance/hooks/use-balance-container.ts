import { useTranslation } from '@/integrations/i18n';
import { useCallback, useMemo, useState } from 'react';
import { generateTokenOptions } from './config';

export const useBalanceContainer = () => {
  const {t} = useTranslation('balance-page');

  const tokenOptions = useMemo(() => generateTokenOptions(t), [t]);
  const [selectedToken, setSelectedToken] = useState(tokenOptions[0].value);

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

  const onSelectToken = useCallback((value: string) => {
    setSelectedToken(value);
  }, []);

  return {
    t,
    tokenOptions,
    selectedToken,
    balance,
    incomingBalance,
    isOpenDialog,
    onCloseDialog,
    onOpenDialog,
    onSelectToken,
  };
};