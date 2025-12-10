
import z from 'zod';
import {
  regexLowerCase,
  regexNumber,
  regexSpace,
  regexSpecialCharacters,
  regexUpperCase,
} from '@/constant';
import type { TFunction } from 'i18next';

const resetPasswordFormSchema = (t: TFunction) => z
  .object({
    password: z
      .string()
      .min(1, {
        message: t('errors.common.field-required', {
          field: t('fields.new-password.label'),
          ns: "common"
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
    confirmPassword: z.string().min(1, {
      message: t('errors.common.field-required', {
        field: t('fields.confirmPassword.label'),
        ns: "common"
      }),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password) {
      if (!!data.confirmPassword && data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: 'custom',
          message: t('errors.MSG-1.20'),
          path: ['confirmPassword'],
        });
      }
    }
  });

type ResetPasswordFormData = z.infer<ReturnType<typeof resetPasswordFormSchema>>;

const initialFormData: ResetPasswordFormData = {
  password: '',
  confirmPassword: '',
};

export { resetPasswordFormSchema, type ResetPasswordFormData, initialFormData };