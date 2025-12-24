import { regexEmail } from '@/constant';
import type { TFunction } from 'i18next';
import z from 'zod';

const merchantInfoFormSchema = (t: TFunction) =>
  z.object({
    firstName: z
      .string()
      .min(1, {
        message: t('errors.common.field-required', {
          field: t('merchant-info.fields.firstName.label'),
          ns: 'common',
        }),
      })
      .max(100, t('errors.validations.MSG-1.3', { ns: 'common' }))
      .superRefine((val, ctx) => {
        if (val.trim().length === 0) {
          ctx.addIssue({
            code: 'custom',
            message: t('errors.common.field-required', {
              field: t('merchant-info.fields.firstName.label'),
              ns: 'common',
            }),
          });
        }
        if (/[^a-zA-Z\d\s]/.test(val)) {
          ctx.addIssue({
            code: 'custom',
            message: t('errors.validations.MSG-1.5', { ns: 'common' }),
          });
        }
        if (/\d/.test(val)) {
          ctx.addIssue({
            code: 'custom',
            message: t('errors.validations.MSG-1.4', { ns: 'common' }),
          });
        }
      }),
    lastName: z
      .string()
      .min(1, {
        message: t('errors.common.field-required', {
          field: t('merchant-info.fields.lastName.label'),
          ns: 'common',
        }),
      })
      .max(100, t('errors.validations.MSG-1.7', { ns: 'common' }))
      .superRefine((val, ctx) => {
        if (val.trim().length === 0) {
          ctx.addIssue({
            code: 'custom',
            message: t('errors.common.field-required', {
              field: t('merchant-info.fields.lastName.label'),
              ns: 'common',
            }),
          });
        }
        if (/[^a-zA-Z\d\s]/.test(val)) {
          ctx.addIssue({
            code: 'custom',
            message: t('errors.validations.MSG-1.9', { ns: 'common' }),
          });
        }
        if (/\d/.test(val)) {
          ctx.addIssue({
            code: 'custom',
            message: t('errors.validations.MSG-1.8', { ns: 'common' }),
          });
        }
      }),
    email: z
      .string()
      .min(1, {
        message: t('errors.common.field-required', {
          field: t('merchant-info.fields.email.label'),
          ns: 'common',
        }),
      })
      .superRefine((val, ctx) => {
        if (val.trim().length === 0) {
          ctx.addIssue({
            code: 'custom',
            message: t('errors.common.field-required', {
              field: t('merchant-info.fields.email.label'),
              ns: 'common',
            }),
          });
        }
        if (!regexEmail.test(val.trim())) {
          ctx.addIssue({
            code: 'custom',
            message: t('errors.validations.MSG-1.10', { ns: 'common' }),
          });
        }
      }),
  });

type MerchantInfoFormData = z.infer<ReturnType<typeof merchantInfoFormSchema>>;

const initialMerchantInfoFormData: MerchantInfoFormData = {
  firstName: '',
  lastName: '',
  email: '',
};

export { initialMerchantInfoFormData, merchantInfoFormSchema, type MerchantInfoFormData };
