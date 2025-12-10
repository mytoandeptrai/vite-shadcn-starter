import { useTranslation } from '@/integrations/i18n';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { balanceWithdrawFormSchema, initialFormData, type BalanceWithdrawFormData } from './schema';
import { useEffect } from 'react';

type Props = {
  onClose?: () => void;
  onSubmit?: () => void;
  max: number;
};

export const useBalanceWithdraw = ({ onClose, max }: Props) => {
  const { t } = useTranslation('balance-page');

  const isLoading = false;

  const form = useForm<BalanceWithdrawFormData>({
    resolver: zodResolver(balanceWithdrawFormSchema(t)),
    defaultValues: initialFormData,
    mode: 'onChange',
  });

  const submit = async (data: BalanceWithdrawFormData) => {
    /** TODO: Request API here */
    const amount = data?.amount;
    console.log('🚀 ~ submit ~ amount:', amount);
    onClose?.();
  };

  useEffect(() => {
    if (max !== null || max !== undefined) {
      form.reset({
        amount: max,
        previousAmount: max,
      });
    }
  }, [max, form.reset]);

  return {
    t,
    form,
    isLoading,
    submit,
  };
};