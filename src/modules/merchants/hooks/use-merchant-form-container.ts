import type { IMerchant } from '@/apis/merchants';
import { useTranslation } from '@/integrations/i18n';
import type { WalletAddressCreateFormData } from '@/modules/wallet-address/hooks/schema';
import { useCallback, useEffect, useState } from 'react';
import { useMerchantFormContext } from '../contexts';
import { initialMerchantCreateFormData, type MerchantCreateFormData } from './schema';

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: Partial<IMerchant>;
  actionType: 'create' | 'inactive' | 'active' | null;
};

export const useMerchantFormContainer = ({ initialData, open, onClose, onSuccess, actionType }: Props) => {
  const { t } = useTranslation('merchants-page');
  const { form, fields } = useMerchantFormContext();

  const [initialAddressData, setInitialAddressData] = useState<WalletAddressCreateFormData | undefined>(undefined);

  const isLoading = false;

  const onCloseDialog = () => {
    onClose?.();
  };

  const onSubmit = async (data: MerchantCreateFormData) => {
    console.log('🚀 ~ onSubmit ~ data:', data);
    switch (actionType) {
      case 'create':
        break;
      case 'active':
        break;
      case 'inactive':
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
      // Map wallet addresses to form structure (extract only needed fields)
      const mappedWalletAddresses = walletAddresses.map((wa) => ({
        chain: wa?.chain,
        crypto: wa?.crypto,
        label: wa?.label,
        address: wa?.address,
        id: wa?.id ? String(wa.id) : undefined,
      }));

      form.reset({
        firstName: initialData.firstName ?? '',
        lastName: initialData.lastName ?? '',
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
