import { useTranslation } from '@/integrations/i18n';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { developerApiUrlsFormSchema, initialFormData, type DeveloperApiUrlsFormData } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';

export const useDeveloperApiUrlsContainer = () => {
  const { t } = useTranslation('developer-page');
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  /** TODO: Request API here */
  const isLoading = false;
  const notifyUrl = 'https://api.example.com/notify';
  const returnUrl = 'https://api.example.com/return';

  const form = useForm<DeveloperApiUrlsFormData>({
    resolver: zodResolver(developerApiUrlsFormSchema(t)),
    defaultValues: initialFormData,
    mode: 'onChange',
  });

  const submit = async (data: DeveloperApiUrlsFormData) => {
    console.log(data);
    /** TODO: Implement API here */
    onCloseDialog();
  };

  const onCloseDialog = useCallback(() => {
    setIsOpenDialog(false);
    form.reset(initialFormData);
  }, [form.reset]);

  const onOpenDialog = useCallback(() => {
    form.reset({
      notifyUrl: notifyUrl,
      returnUrl: returnUrl,
      previousNotifyUrl: notifyUrl,
      previousReturnUrl: returnUrl,
    });
    setIsOpenDialog(true);
  }, [form.reset]);

  return {
    t,
    isLoading,
    notifyUrl,
    returnUrl,
    isOpenDialog,
    form,
    onCloseDialog,
    onOpenDialog,
    submit,
  };
};