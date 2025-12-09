
import z from 'zod';
import {
  regexEmail,
  regexLowerCase,
  regexNumber,
  regexSpace,
  regexSpecialCharacters,
  regexUpperCase,
} from '@/constant';
import type { TFunction } from 'i18next';

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
    password: z
      .string()
      .min(1, {
        message: t('errors.common.field-required', {
          field: t('fields.password.label'),
          ns: 'common',
        }),
      })
      .min(8, { message: t('errors.MSG-1.14') })
      .max(50, { message: t('errors.MSG-1.14') })
      .refine((val) => val.trim().length > 0, {
        message: t('errors.MSG-1.15'),
      })
      .superRefine((val, ctx) => {
        const hasUpperCase = regexUpperCase.test(val);
        const hasLowerCase = regexLowerCase.test(val);
        const hasNumber = regexNumber.test(val);
        const hasSpecialChar = regexSpecialCharacters.test(val);
        const hasSpace = regexSpace.test(val);
        if (!(hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar)) {
          ctx.addIssue({
            code: 'custom',
            message: t('errors.MSG-1.15'),
          });
        }
        if (hasSpace) {
          ctx.addIssue({
            code: 'custom',
            message: t('errors.MSG-1.19'),
          });
        }
      }),
  });

type LoginFormData = z.infer<ReturnType<typeof loginFormSchema>>;

const initialFormData: LoginFormData = {
  email: '',
  password: '',
};

export { loginFormSchema, type LoginFormData, initialFormData };