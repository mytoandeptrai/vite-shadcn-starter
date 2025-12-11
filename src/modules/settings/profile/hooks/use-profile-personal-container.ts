import { useTranslation } from '@/integrations/i18n';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { initialPersonalFormData, personalFormSchema, type PersonalFormData } from './personal.schema';

export const useProfilePersonalContainer = () => {
  const { t } = useTranslation('settings-page');
  const [isUpdated, setIsUpdated] = useState<boolean>(false);

  const isLoading = false;

  const form = useForm<PersonalFormData>({
    resolver: zodResolver(personalFormSchema(t)),
    defaultValues: initialPersonalFormData,
    mode: 'onChange',
  });

  const onSubmit = async (data: PersonalFormData) => {
    console.log('🚀 ~ onSubmit ~ data:', data);
  };

  const onCancel = () => {
    setIsUpdated(false);
    form.reset(initialPersonalFormData);
  };

  return {
    t,
    form,
    isUpdated,
    isLoading,
    setIsUpdated,
    onSubmit,
    onCancel,
  };
};