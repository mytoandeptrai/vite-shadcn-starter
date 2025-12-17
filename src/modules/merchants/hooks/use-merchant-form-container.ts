import type { IMerchant } from '@/apis/merchants';
import { useTranslation } from '@/integrations/i18n';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { initialMerchantCreateFormData, merchantCreateFormSchema, type MerchantCreateFormData } from './schema';

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: Partial<IMerchant>;
  actionType: 'create' | 'inactive' | 'active' | null;
};

export const useMerchantFormContainer = ({ initialData, open, onClose, onSuccess, actionType }: Props) => {
  const { t } = useTranslation('merchants-page');

  const form = useForm<MerchantCreateFormData>({
    resolver: zodResolver(merchantCreateFormSchema(t)),
    defaultValues: initialMerchantCreateFormData,
    mode: 'onChange',
  });

  const isLoading = false;

  const onCloseDialog = () => {
    form.reset(initialMerchantCreateFormData);
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

  const onSubmitDialog = () => {
    form.handleSubmit(onSubmit)();
  };

  useEffect(() => {
    if (open && initialData) {
      form.reset({
        firstName: initialData.firstName ?? '',
        lastName: initialData.lastName ?? '',
        email: initialData.email ?? '',
      });
    } else if (open && !initialData) {
      form.reset(initialMerchantCreateFormData);
    }
  }, [initialData, form.reset, open]);

  return {
    t,
    isLoading,
    open,
    form,
    onCloseDialog,
    onSubmit,
    onSubmitDialog,
  };
};
