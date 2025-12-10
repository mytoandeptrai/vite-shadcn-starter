
import { regexEmail } from '@/constant';
import type { TFunction } from 'i18next';
import z from 'zod';

const forgotPasswordFormSchema = (t: TFunction) =>
  z.object({
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
            message: t('errors.MSG-1.10'),
          });
        }
      }),
  });

type ForgotPasswordFormData = z.infer<ReturnType<typeof forgotPasswordFormSchema>>;

const initialFormData: ForgotPasswordFormData = {
  email: '',
};

export { initialFormData, forgotPasswordFormSchema, type ForgotPasswordFormData };
