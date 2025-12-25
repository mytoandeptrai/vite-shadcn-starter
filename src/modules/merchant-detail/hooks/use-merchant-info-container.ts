import { KEYS, useUpdateMarketplaceMerchant } from '@/apis/marketplace';
import { useTranslation } from '@/integrations/i18n';
import { getContext } from '@/integrations/tanstack-query/root-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import isEqual from 'lodash/isEqual';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { MerchantInfoContainerProps } from '../containers/merchant-info-container';
import { initialMerchantInfoFormData, merchantInfoFormSchema, type MerchantInfoFormData } from './merchant-info.schema';

export const useMerchantInfoContainer = ({ onRefetch, merchant }: MerchantInfoContainerProps) => {
  const { t } = useTranslation('merchant-detail-page');
  const [isUpdated, setIsUpdated] = useState<boolean>(false);

  const { queryClient } = getContext();

  const updateMerchantMutation = useUpdateMarketplaceMerchant();
  const isLoading = updateMerchantMutation.isPending;

  const form = useForm<MerchantInfoFormData>({
    resolver: zodResolver(merchantInfoFormSchema(t)),
    defaultValues: initialMerchantInfoFormData,
    mode: 'onChange',
  });

  const onSubmit = async (data: MerchantInfoFormData) => {
    if (
      isEqual(data, {
        firstName: merchant?.firstname ?? '',
        lastName: merchant?.lastname ?? '',
        email: merchant?.email,
      })
    ) {
      setIsUpdated(false);
      return;
    }

    await updateMerchantMutation.mutateAsync({
      id: merchant?.id?.toString() ?? '',
      email: data.email,
      firstname: data.firstName,
      lastname: data.lastName,
    });
    toast.success(t('merchant-info.messages.update-success'));
    queryClient.invalidateQueries({ queryKey: [KEYS.MERCHANT_DETAIL, { id: merchant?.id?.toString() ?? '' }] });
    onRefetch?.();
    setIsUpdated(false);
  };

  const onCancel = () => {
    setIsUpdated(false);
    form.reset({
      firstName: merchant?.firstname ?? '',
      lastName: merchant?.lastname ?? '',
      email: merchant?.email,
    });
  };

  useEffect(() => {
    if (merchant) {
      form.reset({
        firstName: merchant?.firstname ?? '',
        lastName: merchant?.lastname ?? '',
        email: merchant?.email,
      });
    }
  }, [merchant, form.reset]);

  return {
    t,
    form,
    isUpdated,
    isLoading,
    setIsUpdated,
    onSubmit,
    onCancel,
  };
};
