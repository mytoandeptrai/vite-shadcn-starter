import { useLoginMutation, useVerifyTwoFa } from '@/apis/auth';
import { sanitizeRedirect, usePreviousLocation } from '@/hooks/use-previous-location';
import { useTranslation } from '@/integrations/i18n';
import { useSessionStore } from '@/stores/use-session-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { initialFormData, loginFormSchema, type LoginFormData } from './schema';
import { useAuthContext } from '@/integrations/auth/auth-provider';
import { toast } from 'sonner';
import { useDialogContext } from '@/integrations/dialog/dialog-provider';

type OnSuccessPayload = {
  accessToken: string;
  refreshToken: string;
};

export const useLoginContainer = () => {
  const { t } = useTranslation('login-page');
  const navigate = useNavigate();
  const previousLocation = usePreviousLocation();

  const { setAccessToken, setRefreshToken } = useSessionStore();
  const { onRefetch } = useAuthContext();
  const { onOpenTwoFAModal, onCloseModal } = useDialogContext();

  const verifyTwoFaMutation = useVerifyTwoFa();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema(t)),
    defaultValues: initialFormData,
    mode: 'onChange',
  });

  const useLogin = useLoginMutation();
  const isLoading = useLogin.isPending;

  const onSuccess = async (payload: OnSuccessPayload) => {
    toast.success(t('messages.login-success', { ns: 'common' }));
    setAccessToken(payload.accessToken!);
    setRefreshToken(payload.refreshToken!);
    await onRefetch();
    onCloseModal();
    const target = sanitizeRedirect(previousLocation);
    navigate({ to: target });
  };

  const onSubmit = async (payload: LoginFormData & { code?: string }) => {
    if (isLoading) return;
    try {
      const { data } = await useLogin.mutateAsync(payload);

      if (!data) return;

      if (!data?.requiresTwoFA) {
        return await onSuccess(data);
      }

      onOpenTwoFAModal({
        forceOpen: true,
        skipInitVerification: true,
        isLoading: useLogin.isPending,
        closeOnSubmit: false,
        cb: async (code) => {
          const res = await verifyTwoFaMutation.mutateAsync({
            email: payload.email,
            password: payload.password,
            code: code!,
          });

          if (res.data) {
            await onSuccess(res.data);
          }
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return {
    t,
    isLoading,
    form,
    onSubmit,
  };
};
