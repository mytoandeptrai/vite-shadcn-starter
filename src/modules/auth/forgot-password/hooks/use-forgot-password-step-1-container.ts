import { useTranslation } from '@/integrations/i18n';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import type { ForgotPasswordFormData } from './schema';

export const useForgotPasswordStep_1Container = ({
  onSubmit,
}: {
  onSubmit: (requestForgotPasswordAt?: string) => void;
}) => {
  const { t } = useTranslation('forgot-password-page');
  const isLoading = false;

  const { handleSubmit } = useFormContext<ForgotPasswordFormData>();

  const submit = handleSubmit(async ({ email }: ForgotPasswordFormData) => {
    try {
      /** Todo: Request API */
      console.log("🚀 ~ useForgotPasswordStep_1Container ~ email:", email)
      onSubmit(new Date().toISOString());
      toast.success(t('messages.change-success'));
    } catch (e) {
      console.log('🚀 ~ useForgotPasswordStep_1Container ~ e:', e);
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