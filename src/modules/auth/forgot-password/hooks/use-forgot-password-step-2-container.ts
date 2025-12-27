import { useForgotPassword } from '@/apis/auth';
import { useCountdownTimer } from '@/hooks/use-count-down-timer';
import { useTranslation } from '@/integrations/i18n';
import { formatDuration } from '@/utils';
import { addMinutes } from 'date-fns';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import type { ForgotPasswordFormData } from './schema';

export const useForgotPasswordStep_2Container = ({
  expirationTime,
  onSubmit,
}: {
  onSubmit: (requestForgotPasswordAt?: string) => void;
  expirationTime: string | null;
}) => {
  const { t } = useTranslation('forgot-password-page');
  const { watch } = useFormContext<ForgotPasswordFormData>();
  const [expireDate, setExpireDate] = useState<Date | undefined>(undefined);

  const forgotPasswordMutation = useForgotPassword();
  const isLoading = forgotPasswordMutation.isPending;

  const { left, isEnd } = useCountdownTimer(expireDate ? new Date(expireDate).getTime() : 0);
  const formatTime = formatDuration(left);

  const submit = async () => {
    const email = watch('email').trim();
    if (!email) return;
    await forgotPasswordMutation.mutateAsync({ email: email });
    onSubmit(new Date().toISOString());
    toast.success(t('messages.resend-verification-success', { ns: 'common' }));
  };

  useEffect(() => {
    setExpireDate(expirationTime ? addMinutes(new Date(expirationTime), 5) : undefined);
  }, [expirationTime]);

  return {
    t,
    isLoading,
    formatTime,
    isEnd,
    submit,
  };
};
