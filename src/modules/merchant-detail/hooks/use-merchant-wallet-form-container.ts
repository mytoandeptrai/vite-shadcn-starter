import { useCreateMarketplaceMerchantWallet } from '@/apis/marketplace';
import { useDeleteWalletAddress, useUpdateWalletAddress } from '@/apis/wallet-address';
import { useTranslation } from '@/integrations/i18n';
import {
  initialWalletAddressCreateFormData,
  walletAddressCreateFormSchema,
  type WalletAddressCreateFormData,
} from '@/modules/wallet-address/hooks/schema';
import { CHAIN_OPTIONS, CRYPTO_OPTIONS } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { MerchantDetailWalletFormContainerProps } from '../containers/merchant-detail-wallet-form-container';

export const useMerchantWalletFormContainer = ({
  open,
  onClose,
  onSuccess,
  initialData,
  actionType,
  merchantId,
}: MerchantDetailWalletFormContainerProps) => {
  const { t } = useTranslation('wallet-address-page');

  const options = useMemo(() => CHAIN_OPTIONS(t), [t]);
  const cryptoOptions = useMemo(() => CRYPTO_OPTIONS(t), [t]);

  const createMerchantWalletMutation = useCreateMarketplaceMerchantWallet();
  const updateAddressMutation = useUpdateWalletAddress();
  const deleteAddressMutation = useDeleteWalletAddress();

  const form = useForm<WalletAddressCreateFormData>({
    resolver: zodResolver(walletAddressCreateFormSchema(t)),
    defaultValues: initialWalletAddressCreateFormData,
    mode: 'onChange',
  });

  const isLoading =
    createMerchantWalletMutation.isPending || updateAddressMutation.isPending || deleteAddressMutation.isPending;

  const onCloseDialog = () => {
    form.reset(initialWalletAddressCreateFormData);
    onClose?.();
  };

  const onSubmit = async (data: WalletAddressCreateFormData) => {
    if (isLoading) return;
    switch (actionType) {
      case 'create':
        await createMerchantWalletMutation.mutateAsync({
          ...data,
          merchantId,
        });
        toast.success(t('wallet-management.messages.create-merchant-wallet-success', { ns: 'merchant-detail-page' }));
        break;
      case 'update':
        await updateAddressMutation.mutateAsync({ ...data, id: data.id! });
        toast.success(t('wallet-management.messages.update-merchant-wallet-success', { ns: 'merchant-detail-page' }));
        break;
      case 'delete':
        await deleteAddressMutation.mutateAsync({ id: data.id! });
        toast.success(t('wallet-management.messages.delete-merchant-wallet-success', { ns: 'merchant-detail-page' }));
        break;
      case 'active':
        await updateAddressMutation.mutateAsync({ ...data, id: data.id!, isActive: true });
        toast.success(t('wallet-management.messages.activate-merchant-wallet-success', { ns: 'merchant-detail-page' }));
        break;
      case 'inactive':
        await updateAddressMutation.mutateAsync({ ...data, id: data.id!, isActive: false });
        toast.success(
          t('wallet-management.messages.deactivate-merchant-wallet-success', { ns: 'merchant-detail-page' })
        );
        break;
      default:
        break;
    }
    onCloseDialog();
    onSuccess?.();
  };

  const onSubmitDialog = () => {
    form.handleSubmit(onSubmit)();
  };

  useEffect(() => {
    form.reset({
      address: initialData?.address ?? '',
      chain: initialData?.chain ?? '',
      id: initialData?.id ? String(initialData.id) : '',
      crypto: initialData?.crypto ?? '',
      label: initialData?.label ?? '',
    });
  }, [initialData, form.reset]);

  return {
    t,
    isLoading,
    actionType,
    open,
    form,
    options,
    cryptoOptions,
    isEdit: !!initialData?.id,
    onCloseDialog,
    onSubmit,
    onSubmitDialog,
  };
};