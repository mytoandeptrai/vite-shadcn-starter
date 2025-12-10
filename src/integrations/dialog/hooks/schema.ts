
import type { TFunction } from 'i18next';
import z from 'zod';

const twoFaFormSchema = (t: TFunction) =>
  z.object({
    code: z
      .string()
      .min(1, {
        message: t('errors.common.field-required', {
          field: t('dialogs.two-fa.fields.code.label'),
          ns: 'common',
        }),
      })
      .max(6, t('dialogs.two-fa.errors.MSG-1.3'))
      .superRefine((val, ctx) => {
        if (val.trim().length === 0) {
          ctx.addIssue({
            code: 'custom',
            message: t('errors.common.field-required', {
              field: t('dialogs.two-fa.fields.code.label'),
              ns: 'common',
            }),
          });
        }
        if (/[^a-zA-Z\d\s]/.test(val)) {
          ctx.addIssue({
            code: 'custom',
            message: t('dialogs.two-fa.errors.MSG-1.5'),
          });
        }
      }),
  });

type TwoFaFormData = z.infer<ReturnType<typeof twoFaFormSchema>>;

const initialFormData: TwoFaFormData = {
  code: '',
};

export { initialFormData, twoFaFormSchema, type TwoFaFormData };
