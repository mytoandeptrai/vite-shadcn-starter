import { formatCurrencyWithDecimals } from '@/utils';
import type { TFunction } from 'i18next';
import z from 'zod';

const balanceWithdrawFormSchema = (t: TFunction) =>
  z
    .object({
      amount: z
        .number()
        .min(0, {
          message: t('errors.common.field-gte', {
            field: t('dialogs.balance-withdraw.fields.amount.label'),
            amount: 0,
            ns: 'common',
          }),
        }),
      previousAmount: z.number().optional(),
      address: z.string().min(1, {
        message: t('errors.common.field-required', {
          field: t('dialogs.balance-withdraw.fields.address.label'),
          ns: 'common',
        }),
      }),
    })
    .superRefine((data, ctx) => {
      // Validate amount <= previousAmount (max balance)
      if (data.previousAmount !== undefined && data.amount > data.previousAmount) {
        ctx.addIssue({
          code: 'custom',
          path: ['amount'],
          message: t('errors.common.new-amount-must-be-less-than-or-equal-to-current-amount', {
            currentAmount: formatCurrencyWithDecimals({ num: data.previousAmount, maxDecimals: 0, minDecimals: 0 }),
            ns: 'common',
          }),
        });
      }
    });

type BalanceWithdrawFormData = z.infer<ReturnType<typeof balanceWithdrawFormSchema>>;

const initialFormData: BalanceWithdrawFormData = {
  amount: 0,
  previousAmount: 0,
  address: '',
};

export { initialFormData, balanceWithdrawFormSchema, type BalanceWithdrawFormData };
