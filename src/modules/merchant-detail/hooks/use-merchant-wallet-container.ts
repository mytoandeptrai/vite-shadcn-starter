import { KEYS } from '@/apis/marketplace';
import type { IWalletAddress } from '@/apis/wallet-address';
import { useTranslation } from '@/integrations/i18n';
import { getContext } from '@/integrations/tanstack-query/root-provider';
import { useCallback, useState } from 'react';

export type WalletActionType = 'create' | 'update' | 'delete' | 'active' | 'inactive' | null;

export const useMerchantWalletContainer = ({
  merchantId,
  onRefetch,
}: {
  merchantId: string;
  onRefetch: () => void;
}) => {
  const { t } = useTranslation('merchant-detail-page');
  const { queryClient } = getContext();

  const [actionType, setActionType] = useState<WalletActionType>(null);
  const [selectedWallet, setSelectedWallet] = useState<IWalletAddress | undefined>(undefined);

  const onAdd = useCallback(() => {
    setSelectedWallet(undefined);
    setActionType('create');
  }, []);

  const onClose = useCallback(() => {
    setActionType(null);
    setSelectedWallet(undefined);
  }, []);

  const onSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [KEYS.MERCHANT_DETAIL, merchantId] });
    onRefetch?.();
    onClose();
  }, [queryClient, onRefetch, onClose, merchantId]);

  const onAction = useCallback((wallet: IWalletAddress, actionType: WalletActionType) => {
    setSelectedWallet(wallet);
    setActionType(actionType);
  }, []);

  return {
    t,
    actionType,
    selectedWallet,
    merchantId,
    onAdd,
    onClose,
    onSuccess,
    onAction,
  };
};
