import type { TFunction } from 'i18next';
import z from 'zod';

const twoFaRemoveFormSchema = (t: TFunction) =>
  z.object({
    password: z.string().min(1, {
      message: t('errors.common.field-required', {
        field: t('system.labels.two-fa.remove-modal.fields.password.label'),
        ns: 'common',
      }),
    }),
  });

type TwoFaRemoveFormData = z.infer<ReturnType<typeof twoFaRemoveFormSchema>>;

const initialFormData: TwoFaRemoveFormData = {
  password: '',
};

export { initialFormData, twoFaRemoveFormSchema, type TwoFaRemoveFormData };

