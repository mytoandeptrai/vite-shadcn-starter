import useCountDown from '@/hooks/use-count-down';
import { useTranslation } from '@/integrations/i18n';
import { addMinutes } from 'date-fns';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
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
  const [expireDate, setExpireDate] = useState<Date | undefined>(undefined)
  
  const isLoading = false;
  const { countdown, isReady, isCounting } = useCountDown(expireDate);
  const [minutes, seconds] = countdown.slice(2);

  const _isCounting = isCounting || !isReady;

  const submit = async () => {
    try {
      /** Todo: Request API */
      const email = watch('email').trim();
      console.log("🚀 ~ submit ~ email:", email)
      onSubmit(new Date().toISOString());
      setExpireDate(new Date())
    } catch (e) {
      console.log('🚀 ~ useForgotPasswordStep_2Container ~ e:', e);
    }
  };

  useEffect(() => {
    setExpireDate(expirationTime ? addMinutes(new Date(expirationTime), 5) : undefined)
  }, [expirationTime])
  

  return {
    t,
    isLoading,
    minutes,
    seconds,
    isCounting,
    _isCounting,
    submit,
  };
};