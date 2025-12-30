import { useTranslation } from '@/integrations/i18n';
import type { WalletAddressCreateFormData } from '@/modules/wallet-address/hooks/schema';
import { useCallback, useEffect, useState } from 'react';
import { useMerchantFormContext } from '../contexts';
import { initialMerchantCreateFormData, type MerchantCreateFormData } from './schema';
import type { ActionType } from './use-merchant-container';
import {
  useCreateMarketplaceMerchant,
  useDeleteMarketplaceMerchant,
  useUpdateMarketplaceMerchant,
  type IMerchant,
} from '@/apis/marketplace';
import { toast } from 'sonner';

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: Partial<IMerchant>;
  actionType: ActionType;
};

export const useMerchantFormContainer = ({ initialData, open, onClose, onSuccess, actionType }: Props) => {
  const { t } = useTranslation('merchants-page');
  const { form, fields } = useMerchantFormContext();

  const [initialAddressData, setInitialAddressData] = useState<WalletAddressCreateFormData | undefined>(undefined);

  const updateMarketplaceMerchantMutation = useUpdateMarketplaceMerchant();
  const createMarketplaceMerchantMutation = useCreateMarketplaceMerchant();
  const deleteMarketplaceMerchantMutation = useDeleteMarketplaceMerchant();

  const isLoading =
    updateMarketplaceMerchantMutation.isPending ||
    createMarketplaceMerchantMutation.isPending ||
    deleteMarketplaceMerchantMutation.isPending;

  const onCloseDialog = () => {
    onClose?.();
  };

  const onSubmit = async (data: MerchantCreateFormData) => {
    if (isLoading) return;
    const payload = {
      firstname: data.firstName,
      lastname: data.lastName,
      email: data.email,
      walletAddresses: data.walletAddresses,
    };
    switch (actionType) {
      case 'create':
        await createMarketplaceMerchantMutation.mutateAsync(payload);
        toast.success(t('messages.merchant-created'));
        break;
      case 'update':
        await updateMarketplaceMerchantMutation.mutateAsync({
          ...payload,
          id: initialData?.id?.toString() ?? '',
        });
        toast.success(t('messages.merchant-updated'));
        break;
      case 'inactive':
        await updateMarketplaceMerchantMutation.mutateAsync({
          id: initialData?.id?.toString() ?? '',
          status: 'INACTIVE',
        });
        toast.success(t('messages.merchant-updated'));
        break;
      case 'active':
        await updateMarketplaceMerchantMutation.mutateAsync({
          id: initialData?.id?.toString() ?? '',
          status: 'ACTIVE',
        });
        toast.success(t('messages.merchant-updated'));
        break;
      case 'suspend':
        await deleteMarketplaceMerchantMutation.mutateAsync({ id: initialData?.id?.toString() ?? '' });
        toast.success(t('messages.merchant-suspended'));
        break;
      default:
        break;
    }
    onCloseDialog();
    onSuccess?.();
  };

  const onAddWalletAddress = () => {
    setInitialAddressData({
      chain: '',
      crypto: '',
      label: '',
      address: '',
    });
  };

  const onUpdateWalletAddress = (index: number) => {
    const walletAddress = fields[index];
    if (!walletAddress) return;
    setInitialAddressData({
      chain: walletAddress.chain,
      crypto: walletAddress.crypto,
      label: walletAddress.label,
      address: walletAddress.address,
      id: walletAddress.id,
    });
  };

  const onCloseWalletForm = useCallback(() => {
    setInitialAddressData(undefined);
  }, []);

  useEffect(() => {
    if (open && initialData) {
      const walletAddresses = initialData?.walletAddresses ?? [];
      const mappedWalletAddresses = walletAddresses.map((wa) => ({
        chain: wa?.chain,
        crypto: wa?.crypto,
        label: wa?.label,
        address: wa?.address,
        id: wa?.id ? String(wa.id) : undefined,
      }));

      form.reset({
        firstName: initialData.firstname ?? '',
        lastName: initialData.lastname ?? '',
        email: initialData.email ?? '',
        walletAddresses: mappedWalletAddresses,
      });
    } else if (open && !initialData) {
      // For create mode, start with empty wallet addresses array
      form.reset({
        ...initialMerchantCreateFormData,
        walletAddresses: [],
      });
    }
  }, [initialData, form.reset, open]);

  return {
    t,
    isLoading,
    form,
    initialAddressData,
    onCloseDialog,
    onSubmit,
    onAddWalletAddress,
    onCloseWalletForm,
    onUpdateWalletAddress,
  };
};
