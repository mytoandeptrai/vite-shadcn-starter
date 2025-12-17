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

const developerApiKeyFormSchema = (t: TFunction) =>
  z.object({
    name: z
      .string()
      .min(1, {
        message: t('errors.common.field-required', {
          field: t('api-keys.dialogs.generate-new-key.fields.name.label'),
          ns: 'common',
        }),
      })
      .superRefine((val, ctx) => {
        if (val.trim().length === 0) {
          ctx.addIssue({
            code: 'custom',
            message: t('errors.common.field-required', {
              field: t('api-keys.dialogs.generate-new-key.fields.name.label'),
              ns: 'common',
            }),
          });
        }
      }),
    environment: z.string().min(1, {
      message: t('errors.common.field-required', {
        field: t('api-keys.dialogs.generate-new-key.fields.environment.label'),
        ns: 'common',
      }),
    }),
    expiresIn: z
      .string()
      .min(1, {
        message: t('errors.common.field-required', {
          field: t('api-keys.dialogs.generate-new-key.fields.expiresIn.label'),
          ns: 'common',
        }),
      })
      .refine(
        (val) => {
          const numVal = Number(val);
          return !Number.isNaN(numVal);
        },
        {
          message: t('errors.common.field-invalid', {
            field: t('api-keys.dialogs.generate-new-key.fields.expiresIn.label'),
            ns: 'common',
          }),
        }
      ),
    permissions: z.array(z.string()).min(1, {
      message: t('errors.common.field-required', {
        field: t('api-keys.dialogs.generate-new-key.fields.permissions.label'),
        ns: 'common',
      }),
    }),
  });

type DeveloperApiKeyFormData = z.infer<ReturnType<typeof developerApiKeyFormSchema>>;

const initialApiKeyFormData: DeveloperApiKeyFormData = {
  name: '',
  environment: '',
  expiresIn: '365',
  permissions: [],
};

export {
  developerApiUrlsFormSchema,
  initialFormData,
  type DeveloperApiUrlsFormData,
  developerApiKeyFormSchema,
  initialApiKeyFormData,
  type DeveloperApiKeyFormData,
};
