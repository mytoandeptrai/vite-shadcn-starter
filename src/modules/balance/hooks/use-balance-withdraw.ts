import { useTranslation } from '@/integrations/i18n';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { balanceWithdrawFormSchema, initialFormData, type BalanceWithdrawFormData } from './schema';
import type { BalanceWithdrawUiProps } from '../components/balance-withdraw-ui';
import { useCreateWithdrawal } from '@/apis/withdrawals';
import { getContext } from '@/integrations/tanstack-query/root-provider';
import { KEYS } from '@/apis/transactions';
import { toast } from 'sonner';

export const useBalanceWithdraw = ({ onClose, max, balanceId }: BalanceWithdrawUiProps) => {
  const { t } = useTranslation('balance-page');
  const { queryClient } = getContext();

  const createWithdrawalMutation = useCreateWithdrawal();
  const isLoading = createWithdrawalMutation.isPending;

  const form = useForm<BalanceWithdrawFormData>({
    resolver: zodResolver(balanceWithdrawFormSchema(t)),
    defaultValues: initialFormData,
    mode: 'onChange',
  });

  const submit = async (data: BalanceWithdrawFormData) => {
    if (!balanceId || !data.amount) return;
    await createWithdrawalMutation.mutateAsync({
      amount: data.amount,
      external_wallet_id: +data.address,
      wallet_balance_id: balanceId,
    });
    queryClient.invalidateQueries({ queryKey: [KEYS.TRANSACTIONS] });
    toast.success(t('messages.withdrawal-success'));
    onClose?.();
  };

  useEffect(() => {
    if (max !== null || max !== undefined) {
      form.reset({
        amount: undefined,
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
