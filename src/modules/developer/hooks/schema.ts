
import { regexUrl } from '@/constant';
import type { TFunction } from 'i18next';
import z from 'zod';

const developerApiUrlsFormSchema = (t: TFunction) =>
  z.object({
    notifyUrl: z
      .string()
      .min(1, {
        message: t('errors.common.field-required', {
          field: t('api-urls.dialogs.update-urls.fields.notify-url.label'),
          ns: 'common',
        }),
      })
      .superRefine((val, ctx) => {
        if (val.trim().length === 0) {
          ctx.addIssue({
            code: 'custom',
            message: t('errors.common.field-required', {
              field: t('api-urls.dialogs.update-urls.fields.notify-url.label'),
              ns: 'common',
            }),
          });
        }
        if (!regexUrl.test(val.trim())) {
          ctx.addIssue({
            code: 'custom',
            message: t('errors.common.field-invalid', {
              field: t('api-urls.dialogs.update-urls.fields.notify-url.label'),
              ns: 'common',
            }),
          });
        }
      }),
    returnUrl: z
      .string()
      .min(1, {
        message: t('errors.common.field-required', {
          field: t('api-urls.dialogs.update-urls.fields.return-url.label'),
          ns: 'common',
        }),
      })
      .superRefine((val, ctx) => {
        if (val.trim().length === 0) {
          ctx.addIssue({
            code: 'custom',
            message: t('errors.common.field-required', {
              field: t('api-urls.dialogs.update-urls.fields.return-url.label'),
              ns: 'common',
            }),
          });
        }
        if (!regexUrl.test(val.trim())) {
          ctx.addIssue({
            code: 'custom',
            message: t('errors.common.field-invalid', {
              field: t('api-urls.dialogs.update-urls.fields.return-url.label'),
              ns: 'common',
            }),
          });
        }
      }),
    previousNotifyUrl: z.string().optional(),
    previousReturnUrl: z.string().optional(),
  });

type DeveloperApiUrlsFormData = z.infer<ReturnType<typeof developerApiUrlsFormSchema>>;

const initialFormData: DeveloperApiUrlsFormData = {
  notifyUrl: '',
  returnUrl: '',
  previousNotifyUrl: '',
  previousReturnUrl: '',
};

export { developerApiUrlsFormSchema, initialFormData, type DeveloperApiUrlsFormData };
