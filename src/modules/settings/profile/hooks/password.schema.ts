
import z from 'zod';
import { regexLowerCase, regexNumber, regexSpace, regexSpecialCharacters, regexUpperCase } from '@/constant';
import type { TFunction } from 'i18next';

const passwordFormSchema = (t: TFunction) =>
  z
    .object({
      newPassword: z
        .string()
        .min(1, {
          message: t('errors.common.field-required', {
            field: t('profile.password.fields.new-password.label'),
            ns: 'common',
          }),
        })
        .min(8, { message: t('profile.errors.MSG-1.14') })
        .max(50, { message: t('profile.errors.MSG-1.14') })
        .refine((val) => val.trim().length > 0, {
          message: t('profile.errors.MSG-1.15'),
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
              message: t('profile.errors.MSG-1.15'),
            });
          }
          if (hasSpace) {
            ctx.addIssue({
              code: 'custom',
              message: t('profile.errors.MSG-1.19'),
            });
          }
        }),
      confirmNewPassword: z.string().min(1, {
        message: t('errors.common.field-required', {
          field: t('profile.password.fields.confirmNewPassword.label'),
          ns: 'common',
        }),
      }),
    })
    .superRefine((data, ctx) => {
      if (data.newPassword) {
        if (!!data.confirmNewPassword && data.newPassword !== data.confirmNewPassword) {
          ctx.addIssue({
            code: 'custom',
            message: t('profile.errors.MSG-1.20'),
            path: ['confirmNewPassword'],
          });
        }
      }
    });

type PasswordFormSchema = z.infer<ReturnType<typeof passwordFormSchema>>;

const initialPasswordFormData: PasswordFormSchema = {
  newPassword: '',
  confirmNewPassword: '',
};

export { passwordFormSchema, type PasswordFormSchema, initialPasswordFormData };