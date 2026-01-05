import { useTranslation } from '@/integrations/i18n';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { developerApiUrlsFormSchema, initialFormData, type DeveloperApiUrlsFormData } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthContext } from '@/integrations/auth/auth-provider';
import { toast } from 'sonner';
import { Link } from '@tanstack/react-router';
import { ROUTES } from '@/constant';
import { useGetCallbackConfig, useUpdateCallbackConfig } from '@/apis/callback-config';

export const useDeveloperApiUrlsContainer = () => {
  const { t } = useTranslation('developer-page');
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const { user } = useAuthContext();
  const isEnabledTwoFa = user?.twoFAEnabled ?? false;

  const { data, isLoading, refetch } = useGetCallbackConfig();
  const updateCallbackConfigMutation = useUpdateCallbackConfig();

  const notifyUrl = data?.data?.callbackUrl ?? '-';
  const returnUrl = data?.data?.redirectUrl ?? '-';

  const form = useForm<DeveloperApiUrlsFormData>({
    resolver: zodResolver(developerApiUrlsFormSchema(t)),
    defaultValues: initialFormData,
    mode: 'onChange',
  });

  const submit = async (data: DeveloperApiUrlsFormData) => {
    if (updateCallbackConfigMutation.isPending) return;
    await updateCallbackConfigMutation.mutateAsync({
      callbackUrl: data.notifyUrl,
      eventTypes: ['*'] /** Replace in the next phase */,
      redirectUrl: data.returnUrl,
      webhookSecret: 'stringstringstringstringstringst' /** Replace in the next phase */,
      isActive: true /** Replace in the next phase */,
    });
    toast.success(t('api-urls.messages.update-urls-success'));
    refetch();
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
  }, [form.reset, isEnabledTwoFa, t, notifyUrl, returnUrl]);

  return {
    t,
    isLoading,
    notifyUrl,
    returnUrl,
    isOpenDialog,
    isPending: updateCallbackConfigMutation.isPending,
    form,
    onCloseDialog,
    onOpenDialog,
    submit,
  };
};
