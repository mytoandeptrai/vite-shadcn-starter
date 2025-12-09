
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

const registerFormSchema = (t: TFunction) => z
  .object({
    firstName: z
      .string()
      .min(1, {
        message: t('errors.common.field-required', {
          field: t('fields.fullName.label'),
          ns: "common"
        }),
      })
      .max(100, t('errors.MSG-1.3'))
      .superRefine((val, ctx) => {
        if (val.trim().length === 0) {
          ctx.addIssue({
            code: 'custom',
            message: t('errors.common.field-required', {
              field: t('fields.fullName.label'),
              ns: "common"
            }),
          });
        }
        if (/[^a-zA-Z\d\s]/.test(val)) {
          ctx.addIssue({
            code: 'custom',
            message: t('errors.MSG-1.5'),
          });
        }
        if (/\d/.test(val)) {
          ctx.addIssue({
            code: 'custom',
            message: t('errors.MSG-1.4'),
          });
        }
      }),
    lastName: z
      .string()
      .min(1, {
        message: t('errors.common.field-required', {
          field: t('fields.lastName.label'),
          ns: "common"
        }),
      })
      .max(100, t('errors.MSG-1.7'))
      .superRefine((val, ctx) => {
        if (val.trim().length === 0) {
          ctx.addIssue({
            code: 'custom',
            message: t('errors.common.field-required', {
              field: t('fields.lastName.label'),
              ns: "common"
            }),
          });
        }
        if (/[^a-zA-Z\d\s]/.test(val)) {
          ctx.addIssue({
            code: 'custom',
            message: t('errors.MSG-1.9'),
          });
        }
        if (/\d/.test(val)) {
          ctx.addIssue({
            code: 'custom',
            message: t('errors.MSG-1.8'),
          });
        }
      }),
    email: z
      .string()
      .min(1, {
        message: t('errors.common.field-required', {
          field: t('fields.email.label'),
          ns: "common"
        }),
      })
      .superRefine((val, ctx) => {
        if (val.trim().length === 0) {
          ctx.addIssue({
            code: 'custom',
            message: t('errors.common.field-required', {
              field: t('fields.email.label'),
              ns: "common"
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

type RegisterFormData = z.infer<ReturnType<typeof registerFormSchema>>;

const initialFormData: RegisterFormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export { registerFormSchema, type RegisterFormData, initialFormData };