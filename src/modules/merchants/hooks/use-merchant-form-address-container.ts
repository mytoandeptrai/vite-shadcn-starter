import { useTranslation } from '@/integrations/i18n';
import { walletAddressCreateFormSchema, type WalletAddressCreateFormData } from '@/modules/wallet-address/hooks/schema';
import { CHAIN_OPTIONS, CRYPTO_OPTIONS } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { MerchantFormAddressContainerProps } from '../containers/merchant-form-address-container';
import { useMerchantFormContext } from '../contexts';

export const useMerchantFormAddressContainer = ({
  open,
  initialData,
  onSuccess,
  onClose,
}: MerchantFormAddressContainerProps) => {
  const { t } = useTranslation('wallet-address-page');
  const { form: formParent, fields, append } = useMerchantFormContext();

  const options = useMemo(() => CHAIN_OPTIONS(t), [t]);
  const tokenOptions = useMemo(() => CRYPTO_OPTIONS(t), [t]);

  const form = useForm<WalletAddressCreateFormData>({
    resolver: zodResolver(walletAddressCreateFormSchema(t)),
    mode: 'onChange',
  });

  const onCloseDialog = () => {
    form.reset({});
    onClose?.();
  };

  const onCheckDuplicateWalletAddress = (data: WalletAddressCreateFormData, excludeIndex?: number) => {
    const currentWalletAddresses = fields;
    // Create composite key from all 4 fields (case-insensitive for address and label)
    const chainKey = data.chain?.trim() || '';
    const cryptoKey = data.crypto?.trim() || '';
    const labelKey = data.label?.toLowerCase().trim() || '';
    const addressKey = data.address?.toLowerCase().trim() || '';

    // Only check if all fields are present
    if (!chainKey || !cryptoKey || !labelKey || !addressKey) {
      return { isDuplicate: false, errorMessage: '' };
    }

    const compositeKey = `${chainKey}|${cryptoKey}|${labelKey}|${addressKey}`;

    for (let i = 0; i < currentWalletAddresses.length; i++) {
      // Skip the current item being edited
      if (excludeIndex !== undefined && i === excludeIndex) continue;

      const existing = currentWalletAddresses[i];

      // Create composite key for existing wallet address
      const existingChainKey = existing.chain?.trim() || '';
      const existingCryptoKey = existing.crypto?.trim() || '';
      const existingLabelKey = existing.label?.toLowerCase().trim() || '';
      const existingAddressKey = existing.address?.toLowerCase().trim() || '';

      // Skip if any field is missing
      if (!existingChainKey || !existingCryptoKey || !existingLabelKey || !existingAddressKey) {
        continue;
      }

      const existingCompositeKey = `${existingChainKey}|${existingCryptoKey}|${existingLabelKey}|${existingAddressKey}`;

      // Check if all 4 fields match
      if (compositeKey === existingCompositeKey) {
        return {
          isDuplicate: true,
          errorMessage: 'errors.duplicate-wallet-address',
        };
      }
    }

    return { isDuplicate: false, errorMessage: '' };
  };

  const handleCreateWalletAddress = (data: WalletAddressCreateFormData) => {
    append({
      chain: data.chain,
      crypto: data.crypto,
      label: data.label,
      address: data.address,
      id: data.id,
    });
  };

  const handleUpdateWalletAddress = (data: WalletAddressCreateFormData, index: number) => {
    const updatedFields = [...fields];
    updatedFields[index] = {
      ...updatedFields[index],
      ...data,
    };
    formParent.setValue('walletAddresses', updatedFields, { shouldValidate: true });
  };

  const onSubmit = async (data: WalletAddressCreateFormData) => {
    const isEdit = !!data?.id;
    const currentIndex = isEdit ? fields.findIndex((field) => field.id === data.id) : undefined;

    const duplicateCheck = onCheckDuplicateWalletAddress(data, currentIndex);
    if (duplicateCheck.isDuplicate) {
      toast.error(t(duplicateCheck?.errorMessage!));
      return;
    }

    if (isEdit && currentIndex !== undefined && currentIndex !== -1) {
      handleUpdateWalletAddress(data, currentIndex);
    } else {
      handleCreateWalletAddress(data);
    }

    form.reset({});
    onSuccess?.();
  };

  useEffect(() => {
    if (open && initialData) {
      form.reset(initialData);
    }
  }, [initialData, form.reset, open]);

  return {
    t,
    form,
    open,
    options,
    isEdit: !!initialData?.id,
    tokenOptions,
    onCloseDialog,
    onSubmit,
  };
};