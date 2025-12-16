import {
  useCreateWalletAddress,
  useDeleteWalletAddress,
  useUpdateWalletAddress,
  type IWalletAddress,
} from '@/apis/wallet-address';
import { useTranslation } from '@/integrations/i18n';
import { useEffect, useMemo } from 'react';
import { generateOptions, generateTokenOptions } from './config';
import { walletAddressCreateFormSchema, type WalletAddressCreateFormData } from './schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: Partial<IWalletAddress>;
  actionType: 'create' | 'update' | 'delete' | 'activate' | 'deactivate' | null;
};

export const useWalletAddressFormContainer = ({ initialData, open, onClose, onSuccess, actionType }: Props) => {
  const { t } = useTranslation('wallet-address-page');
  const options = useMemo(() => generateOptions(t), [t]);
  const tokenOptions = useMemo(() => generateTokenOptions(t), [t]);

  const createAddressMutation = useCreateWalletAddress();
  const updateAddressMutation = useUpdateWalletAddress();
  const deleteAddressMutation = useDeleteWalletAddress();

  const defaultValue = useMemo(() => {
    return {
      label: '',
      address: '',
      chain: options[0].value,
      token: tokenOptions[0].value,
    };
  }, [options[0].value, tokenOptions[0].value]);

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
        break;
      case 'update':
        await updateAddressMutation.mutateAsync({ ...data, id: data.id! });
        break;
      case 'activate':
        await updateAddressMutation.mutateAsync({ id: data.id!, isActive: true });
        break;
      case 'deactivate':
        await updateAddressMutation.mutateAsync({ id: data.id!, isActive: false });
        break;
      case 'delete':
        await deleteAddressMutation.mutateAsync({ id: data.id! });
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
      token: initialData?.token ?? tokenOptions[0].value,
      label: initialData?.label ?? '',
    });
  }, [initialData, form.reset, options[0].value, tokenOptions[0].value]);

  return {
    t,
    isLoading,
    open,
    form,
    options,
    tokenOptions,
    onCloseDialog,
    onSubmit,
    onSubmitDialog,
  };
};