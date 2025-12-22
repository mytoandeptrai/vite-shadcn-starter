import { useTranslation } from '@/integrations/i18n';
import { generateOptions, generateTokenOptions } from '@/modules/wallet-address/hooks/config';
import { walletAddressCreateFormSchema, type WalletAddressCreateFormData } from '@/modules/wallet-address/hooks/schema';
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

  const options = useMemo(() => generateOptions(t), [t]);
  const tokenOptions = useMemo(() => generateTokenOptions(t), [t]);

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
    const tokenKey = data.token?.trim() || '';
    const labelKey = data.label?.toLowerCase().trim() || '';
    const addressKey = data.address?.toLowerCase().trim() || '';

    // Only check if all fields are present
    if (!chainKey || !tokenKey || !labelKey || !addressKey) {
      return { isDuplicate: false, errorMessage: '' };
    }

    const compositeKey = `${chainKey}|${tokenKey}|${labelKey}|${addressKey}`;

    for (let i = 0; i < currentWalletAddresses.length; i++) {
      // Skip the current item being edited
      if (excludeIndex !== undefined && i === excludeIndex) continue;

      const existing = currentWalletAddresses[i];

      // Create composite key for existing wallet address
      const existingChainKey = existing.chain?.trim() || '';
      const existingTokenKey = existing.token?.trim() || '';
      const existingLabelKey = existing.label?.toLowerCase().trim() || '';
      const existingAddressKey = existing.address?.toLowerCase().trim() || '';

      // Skip if any field is missing
      if (!existingChainKey || !existingTokenKey || !existingLabelKey || !existingAddressKey) {
        continue;
      }

      const existingCompositeKey = `${existingChainKey}|${existingTokenKey}|${existingLabelKey}|${existingAddressKey}`;

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

  const onSubmit = async (data: WalletAddressCreateFormData) => {
    const duplicateCheck = onCheckDuplicateWalletAddress(data);
    if (duplicateCheck.isDuplicate) {
      toast.error(t(duplicateCheck?.errorMessage!));
      return;
    }

    const isEdit = !!data?.id;
    if (isEdit) {
      // Update existing wallet address
      const updatedFields = [...fields];
      const index = updatedFields.findIndex((field) => field.id === data.id);
      if (index !== -1) {
        updatedFields[index] = {
          ...updatedFields[index],
          ...data,
        };
        formParent.setValue('walletAddresses', updatedFields, { shouldValidate: true });
      }
    } else {
      append({
        chain: data.chain,
        token: data.token,
        label: data.label,
        address: data.address,
        id: data.id,
      });
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