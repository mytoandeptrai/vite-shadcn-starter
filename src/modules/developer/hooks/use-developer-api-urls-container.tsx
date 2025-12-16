import { useTranslation } from '@/integrations/i18n';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { developerApiUrlsFormSchema, initialFormData, type DeveloperApiUrlsFormData } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthContext } from '@/integrations/auth/auth-provider';
import { toast } from 'sonner';
import { Link } from '@tanstack/react-router';
import { ROUTES } from '@/constant';

export const useDeveloperApiUrlsContainer = () => {
  const { t } = useTranslation('developer-page');
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const { user } = useAuthContext();
  const isEnabledTwoFa = user?.twoFAEnabled ?? false;

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
    if (!isEnabledTwoFa) {
      toast.error(
        <Link to={ROUTES.SYSTEM} className='hover:underline'>
          {t('messages.require-enable-two-fa', { ns: 'common' })}
        </Link>
      );
      return;
    }

    form.reset({
      notifyUrl: notifyUrl,
      returnUrl: returnUrl,
      previousNotifyUrl: notifyUrl,
      previousReturnUrl: returnUrl,
    });
    setIsOpenDialog(true);
  }, [form.reset, isEnabledTwoFa, t]);

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
