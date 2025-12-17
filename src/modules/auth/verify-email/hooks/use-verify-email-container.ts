import { useResendVerification } from '@/apis/auth';
import { keyLocalStorage } from '@/constant';
import useCountDown from '@/hooks/use-count-down';
import { useTranslation } from '@/integrations/i18n';
import { setLocalStorageItem } from '@/utils';
import { addMinutes, isAfter } from 'date-fns';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const useVerifyEmailContainer = (email?: string) => {
  const { t } = useTranslation('verify-email-page');

  const resendVerificationMutation = useResendVerification();
  const isLoading = resendVerificationMutation.isPending;

  const [expiredDate, setExpiredDate] = useState<Date | undefined>(() => {
    const storedDate = localStorage.getItem(keyLocalStorage.EXPIRED_SIGN_UP_TIME);
    return storedDate ? new Date(Number(storedDate)) : undefined;
  });

  const { countdown, isReady, isCounting } = useCountDown(expiredDate);
  const [minutes, seconds] = countdown.slice(2);
  const _isCounting = isCounting || !isReady;

  const handleClickResend = async () => {
    if (!email) return;
    try {
      await resendVerificationMutation.mutateAsync({ email: email! });
      const newExpiredDate = addMinutes(new Date(), 5);
      const newExpiredTimestamp = newExpiredDate.getTime();
      setLocalStorageItem(keyLocalStorage.EXPIRED_SIGN_UP_TIME, `${newExpiredTimestamp}`);
      setExpiredDate(newExpiredDate);
      toast.success(t('messages.resend-verification-success', { ns: 'common' }));
    } catch (error) {
      console.log('🚀 ~ handleClickResend ~ error:', error);
    }
  };

  useEffect(() => {
    const storedDate = localStorage.getItem(keyLocalStorage.EXPIRED_SIGN_UP_TIME);
    if (storedDate) {
      const expiredDateObj = new Date(Number(storedDate));
      if (isAfter(new Date(), expiredDateObj)) {
        localStorage.removeItem(keyLocalStorage.EXPIRED_SIGN_UP_TIME);
        setExpiredDate(undefined);
      }
    }
  }, []);

  return {
    t,
    minutes,
    seconds,
    isCounting,
    _isCounting,
    isLoading,
    handleClickResend,
  };
};
