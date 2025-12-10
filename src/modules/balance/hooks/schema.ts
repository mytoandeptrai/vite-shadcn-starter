
import { formatCurrencyWithDecimals } from '@/utils';
import type { TFunction } from 'i18next';
import z from 'zod';

const balanceWithdrawFormSchema = (t: TFunction) =>
  z
    .object({
      amount: z.number({
        error: t('errors.common.field-required', {
          field: t('dialogs.balance-withdraw.fields.amount.label'),
          ns: 'common',
        }),
      }),
      previousAmount: z.number().optional(),
    })
    .superRefine((data, ctx) => {
      if (!data.amount && data.amount !== 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['amount'],
          message: t('errors.common.field-required', {
            field: t('dialogs.balance-withdraw.fields.amount.label'),
            ns: 'common',
          }),
        });
      }

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
};

export { initialFormData, balanceWithdrawFormSchema, type BalanceWithdrawFormData };
