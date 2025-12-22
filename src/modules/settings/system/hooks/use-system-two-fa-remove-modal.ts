import { useTranslation } from '@/integrations/i18n';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { initialFormData, twoFaRemoveFormSchema, type TwoFaRemoveFormData } from './schema';

export const useSystemTwoFaRemoveModal = (onSubmit: (password: string) => void) => {
  const { t } = useTranslation('settings-page');

  const form = useForm<TwoFaRemoveFormData>({
    resolver: zodResolver(twoFaRemoveFormSchema(t)),
    defaultValues: initialFormData,
    mode: 'onChange',
  });

  const submit = async (data: TwoFaRemoveFormData) => {
    onSubmit(data.password);
  };

  return {
    t,
    form,
    submit,
  };
};
