import { useTranslation } from '@/integrations/i18n';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import type { ForgotPasswordFormData } from './schema';
import { useForgotPassword } from '@/apis/auth';

export const useForgotPasswordStep_1Container = ({
  onSubmit,
}: {
  onSubmit: (requestForgotPasswordAt?: string) => void;
}) => {
  const { t } = useTranslation('forgot-password-page');
  const forgotPasswordMutation = useForgotPassword();
  const isLoading = forgotPasswordMutation.isPending;

  const { handleSubmit } = useFormContext<ForgotPasswordFormData>();

  const submit = handleSubmit(async ({ email }: ForgotPasswordFormData) => {
    try {
      /** Todo: Request API */
      await forgotPasswordMutation.mutateAsync({ email: email! });
      toast.success(t('messages.forgot-password-success', { ns: 'common' }));
      onSubmit(new Date().toISOString());
    } catch (e) {
      console.error(e);
    }
  });

  const clickContinue = () => {
    submit();
  };

  return {
    t,
    isLoading,
    clickContinue,
  };
};
