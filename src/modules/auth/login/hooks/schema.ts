import { regexEmail } from '@/constant';
import type { TFunction } from 'i18next';
import z from 'zod';

const loginFormSchema = (t: TFunction) =>
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
    password: z.string().min(1, {
      message: t('errors.common.field-required', {
        field: t('fields.password.label'),
        ns: 'common',
      }),
    }),
  });

type LoginFormData = z.infer<ReturnType<typeof loginFormSchema>>;

const initialFormData: LoginFormData = {
  email: '',
  password: '',
};

export { initialFormData, loginFormSchema, type LoginFormData };

