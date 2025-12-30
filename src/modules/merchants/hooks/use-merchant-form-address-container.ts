import { useTranslation } from '@/integrations/i18n';
import { walletAddressCreateFormSchema, type WalletAddressCreateFormData } from '@/modules/wallet-address/hooks/schema';
import { CHAIN_OPTIONS, CRYPTO_OPTIONS } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { MerchantFormAddressContainerProps } from '../containers/merchant-form-address-container';
import { useMerchantFormContext } from '../contexts';
import { MAX_WALLETS_PER_CHAIN } from '@/constant';

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
    const chainKey = data.chain?.trim() || '';
    const cryptoKey = data.crypto?.trim() || '';
    const addressKey = data.address?.toLowerCase().trim() || '';

    // Only check if required fields are present
    if (!chainKey || !cryptoKey || !addressKey) {
      return { isValid: true, errorMessage: '' };
    }

    // Create composite key from chain + crypto + address (không cần label)
    const compositeKey = `${chainKey}|${cryptoKey}|${addressKey}`;

    // 1. Check for duplicate wallet: chain + crypto + address
    for (let i = 0; i < currentWalletAddresses.length; i++) {
      // Skip the current item being edited
      if (excludeIndex !== undefined && i === excludeIndex) continue;

      const existing = currentWalletAddresses[i];

      const existingChainKey = existing.chain?.trim() || '';
      const existingCryptoKey = existing.crypto?.trim() || '';
      const existingAddressKey = existing.address?.toLowerCase().trim() || '';

      // Skip if any field is missing
      if (!existingChainKey || !existingCryptoKey || !existingAddressKey) {
        continue;
      }

      const existingCompositeKey = `${existingChainKey}|${existingCryptoKey}|${existingAddressKey}`;

      // Check if chain + crypto + address match
      if (compositeKey === existingCompositeKey) {
        return {
          isValid: false,
          errorMessage: t('errors.duplicate-wallet-address', { ns: 'merchants-page' }),
        };
      }
    }

    // 2. Check max wallets per chain (only for create, not for edit)
    if (excludeIndex === undefined) {
      const chainCount = currentWalletAddresses.filter(
        (wallet) => wallet.chain?.trim() === chainKey
      ).length;

      if (chainCount >= MAX_WALLETS_PER_CHAIN) {
        return {
          isValid: false,
          errorMessage: t('errors.max-wallets-per-chain', { max: MAX_WALLETS_PER_CHAIN, ns: 'merchants-page' }),
        };
      }
    }

    return { isValid: true, errorMessage: '' };
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

    const validationResult = onCheckDuplicateWalletAddress(data, currentIndex);
    if (!validationResult.isValid) {
      toast.error(validationResult.errorMessage);
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