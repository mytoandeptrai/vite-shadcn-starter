import { regexEmail } from '@/constant';
import type { TFunction } from 'i18next';
import z from 'zod';

const merchantCreateFormSchema = (t: TFunction) => {
  return z.object({
    firstName: z.string().min(1, {
      message: t('errors.common.field-required', {
        field: t('fields.first-name.label'),
        ns: 'common',
      }),
    }),
    lastName: z.string().min(1, {
      message: t('errors.common.field-required', {
        field: t('fields.last-name.label'),
        ns: 'common',
      }),
    }),
    email: z
      .string()
      .min(1, {
        message: t('errors.common.field-required', {
          field: t('fields.email.label'),
          ns: 'common',
        }),
      })
      .superRefine((val, ctx) => {
        if (val.trim().length === 0) {
          ctx.addIssue({
            code: 'custom',
            message: t('errors.common.field-required', {
              field: t('fields.email.label'),
              ns: 'common',
            }),
          });
        }
        if (!regexEmail.test(val.trim())) {
          ctx.addIssue({
            code: 'custom',
            message: t('errors.common.validations.MSG-1.10', { ns: 'common' }),
          });
        }
      }),
  });
};

type MerchantCreateFormData = z.infer<ReturnType<typeof merchantCreateFormSchema>>;

const initialMerchantCreateFormData: MerchantCreateFormData = {
  firstName: '',
  lastName: '',
  email: '',
};

export { initialMerchantCreateFormData, merchantCreateFormSchema, type MerchantCreateFormData };
