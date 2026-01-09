import {
  useCreateWalletAddress,
  useDeleteWalletAddress,
  useUpdateWalletAddress,
  type IWalletAddress,
} from '@/apis/wallet-address';
import { useTranslation } from '@/integrations/i18n';
import { CHAIN_OPTIONS, CRYPTO_OPTIONS } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { walletAddressCreateFormSchema, type WalletAddressCreateFormData } from './schema';
import { getContext } from '@/integrations/tanstack-query/root-provider';
import { KEYS } from '@/apis/dashboard';

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: Partial<IWalletAddress>;
  actionType: 'create' | 'update' | 'delete' | 'activate' | 'deactivate' | null;
};

export const useWalletAddressFormContainer = ({ initialData, open, onClose, onSuccess, actionType }: Props) => {
  const { t } = useTranslation('wallet-address-page');
  const { queryClient } = getContext();
  const options = useMemo(() => CHAIN_OPTIONS(t), [t]);
  const cryptoOptions = useMemo(() => CRYPTO_OPTIONS(t), [t]);
  const createAddressMutation = useCreateWalletAddress();
  const updateAddressMutation = useUpdateWalletAddress();
  const deleteAddressMutation = useDeleteWalletAddress();

  const defaultValue = useMemo(() => {
    return {
      label: '',
      address: '',
      chain: options[0].value,
      crypto: cryptoOptions[0].value,
      isDefault: false,
    };
  }, [options[0].value, cryptoOptions[0].value]);

  const form = useForm<WalletAddressCreateFormData>({
    resolver: zodResolver(walletAddressCreateFormSchema(t)),
    defaultValues: defaultValue,
    mode: 'onChange',
  });

  const isLoading =
    createAddressMutation.isPending || updateAddressMutation.isPending || deleteAddressMutation.isPending;

  const onCloseDialog = () => {
    form.reset(defaultValue);
    onClose?.();
  };

  const onSubmit = async (data: WalletAddressCreateFormData) => {
    switch (actionType) {
      case 'create':
        await createAddressMutation.mutateAsync(data);
        queryClient.invalidateQueries({ queryKey: [KEYS.START_GUIDE] });
        toast.success(t('messages.add-wallet-address-success'));
        break;
      case 'update':
        await updateAddressMutation.mutateAsync({ ...data, id: data.id! });
        toast.success(t('messages.update-wallet-address-success'));
        break;
      case 'activate':
        await updateAddressMutation.mutateAsync({ id: data.id!, isActive: true, address: data.address });
        toast.success(t('messages.activate-wallet-address-success'));
        break;
      case 'deactivate':
        await updateAddressMutation.mutateAsync({ id: data.id!, isActive: false, address: data.address });
        toast.success(t('messages.deactivate-wallet-address-success'));
        break;
      case 'delete':
        await deleteAddressMutation.mutateAsync({ id: data.id! });
        toast.success(t('messages.delete-wallet-address-success'));
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
      chain: initialData?.chain ?? options[0].value,
      id: initialData?.id ? String(initialData.id) : '',
      crypto: initialData?.crypto ?? cryptoOptions[0].value,
      label: initialData?.label ?? '',
      isDefault: initialData?.isDefault ?? false,
    });
  }, [initialData, form.reset, options[0].value, cryptoOptions[0].value]);

  return {
    t,
    isLoading,
    open,
    form,
    options,
    cryptoOptions,
    onCloseDialog,
    onSubmit,
    onSubmitDialog,
  };
};
