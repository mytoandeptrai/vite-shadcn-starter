import { regexEmail } from '@/constant';
import type { TFunction } from 'i18next';
import z from 'zod';

const personalFormSchema = (t: TFunction) =>
  z.object({
    firstName: z
      .string()
      .min(1, {
        message: t('errors.common.field-required', {
          field: t('profile.personal.fields.firstName.label'),
          ns: 'common',
        }),
      })
      .max(100, t('profile.errors.MSG-1.3'))
      .superRefine((val, ctx) => {
        if (val.trim().length === 0) {
          ctx.addIssue({
            code: 'custom',
            message: t('errors.common.field-required', {
              field: t('profile.personal.fields.firstName.label'),
              ns: 'common',
            }),
          });
        }
        if (/[^a-zA-Z\d\s]/.test(val)) {
          ctx.addIssue({
            code: 'custom',
            message: t('profile.errors.MSG-1.5'),
          });
        }
        if (/\d/.test(val)) {
          ctx.addIssue({
            code: 'custom',
            message: t('profile.errors.MSG-1.4'),
          });
        }
      }),
    lastName: z
      .string()
      .min(1, {
        message: t('errors.common.field-required', {
          field: t('profile.personal.fields.lastName.label'),
          ns: 'common',
        }),
      })
      .max(100, t('profile.errors.MSG-1.7'))
      .superRefine((val, ctx) => {
        if (val.trim().length === 0) {
          ctx.addIssue({
            code: 'custom',
            message: t('errors.common.field-required', {
              field: t('profile.personal.fields.lastName.label'),
              ns: 'common',
            }),
          });
        }
        if (/[^a-zA-Z\d\s]/.test(val)) {
          ctx.addIssue({
            code: 'custom',
            message: t('profile.errors.MSG-1.9'),
          });
        }
        if (/\d/.test(val)) {
          ctx.addIssue({
            code: 'custom',
            message: t('profile.errors.MSG-1.8'),
          });
        }
      }),
    email: z
      .string()
      .min(1, {
        message: t('errors.common.field-required', {
          field: t('profile.personal.fields.email.label'),
          ns: 'common',
        }),
      })
      .superRefine((val, ctx) => {
        if (val.trim().length === 0) {
          ctx.addIssue({
            code: 'custom',
            message: t('errors.common.field-required', {
              field: t('profile.personal.fields.email.label'),
              ns: 'common',
            }),
          });
        }
        if (!regexEmail.test(val.trim())) {
          ctx.addIssue({
            code: 'custom',
            message: t('profile.errors.MSG-1.10'),
          });
        }
      }),
  });

type PersonalFormData = z.infer<ReturnType<typeof personalFormSchema>>;

const initialPersonalFormData: PersonalFormData = {
  firstName: '',
  lastName: '',
  email: '',
};

export { initialPersonalFormData, personalFormSchema, type PersonalFormData };
