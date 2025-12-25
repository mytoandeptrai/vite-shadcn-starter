import { useTranslation } from '@/integrations/i18n';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { initialPersonalFormData, personalFormSchema, type PersonalFormData } from './personal.schema';
import { KEYS, useUpdateMarketplaceInfo, useUpdateUserInfo } from '@/apis/auth';
import { useAuthContext } from '@/integrations/auth/auth-provider';
import { getContext } from '@/integrations/tanstack-query/root-provider';
import isEqual from 'lodash/isEqual';
import { useDialogContext } from '@/integrations/dialog/dialog-provider';
import { toast } from 'sonner';
import { Link } from '@tanstack/react-router';
import { EUserType, ROUTES } from '@/constant';

export const useProfilePersonalContainer = () => {
  const { t } = useTranslation('settings-page');
  const [isUpdated, setIsUpdated] = useState<boolean>(false);

  const { user, onRefetch } = useAuthContext();
  const { onOpenTwoFAModal, onCloseModal } = useDialogContext();
  const { queryClient } = getContext();

  const updateUserInfoMutation = useUpdateUserInfo();
  const updateMarketplaceInfoMutation = useUpdateMarketplaceInfo();

  const mutate = user?.type === EUserType.MARKETPLACE ? updateMarketplaceInfoMutation : updateUserInfoMutation;
  const isLoading = updateUserInfoMutation.isPending || updateMarketplaceInfoMutation.isPending;
  const isEnabledTwoFa = user?.twoFAEnabled ?? false;

  const form = useForm<PersonalFormData>({
    resolver: zodResolver(personalFormSchema(t)),
    defaultValues: initialPersonalFormData,
    mode: 'onChange',
  });

  const onSubmit = async (data: PersonalFormData) => {
    if (
      isEqual(data, {
        firstName: user?.firstname ?? '',
        lastName: user?.lastname ?? '',
        email: user?.email,
      })
    ) {
      setIsUpdated(false);
      return;
    }

    if (!isEnabledTwoFa) {
      toast.error(
        <Link to={ROUTES.SYSTEM} className='hover:underline'>
          {t('messages.require-enable-two-fa', { ns: 'common' })}
        </Link>
      );
      return;
    }

    onOpenTwoFAModal({
      forceOpen: true,
      skipInitVerification: true,
      closeOnSubmit: false,
      cb: async (code) => {
        await mutate.mutateAsync({
          email: data.email,
          firstname: data.firstName,
          lastname: data.lastName,
          twoFACode: code!,  
        });
        toast.success(t('profile.messages.update-profile-success'));
        queryClient.invalidateQueries({ queryKey: [KEYS.INFO] });
        onRefetch();
        setIsUpdated(false);
        onCloseModal();
      },
    });
  };

  const onCancel = () => {
    setIsUpdated(false);
    form.reset({
      firstName: user?.firstname ?? '',
      lastName: user?.lastname ?? '',
      email: user?.email,
    });
  };

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user?.firstname ?? '',
        lastName: user?.lastname ?? '',
        email: user?.email,
      });
    }
  }, [user]);

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
