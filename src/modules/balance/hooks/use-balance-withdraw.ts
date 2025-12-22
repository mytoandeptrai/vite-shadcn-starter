import { useTranslation } from '@/integrations/i18n';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { balanceWithdrawFormSchema, initialFormData, type BalanceWithdrawFormData } from './schema';

type Props = {
  onClose?: () => void;
  onSubmit?: () => void;
  max: number;
  selectedToken: string;
};

export const useBalanceWithdraw = ({ onClose, max }: Props) => {
  const { t } = useTranslation('balance-page');

  /** TODO: Request API based on selected token here */
  const isLoading = false;

  const form = useForm<BalanceWithdrawFormData>({
    resolver: zodResolver(balanceWithdrawFormSchema(t)),
    defaultValues: initialFormData,
    mode: 'onChange',
  });

  const submit = async (data: BalanceWithdrawFormData) => {
    /** TODO: Request API here */
    console.log('🚀 ~ submit ~ data:', data);
    onClose?.();
  };

  useEffect(() => {
    if (max !== null || max !== undefined) {
      form.reset({
        amount: max,
        previousAmount: max,
        address: '',
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
