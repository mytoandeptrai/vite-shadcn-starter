import { useResendVerification } from '@/apis/auth';
import { keyLocalStorage } from '@/constant';
import { useCountdownTimer } from '@/hooks/use-count-down-timer';
import { useTranslation } from '@/integrations/i18n';
import { formatDuration, setLocalStorageItem } from '@/utils';
import { addMinutes, isAfter } from 'date-fns';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const useLinkExpiredContainer = (email?: string) => {
  const { t } = useTranslation('link-expired-page');
  
  const resendVerificationMutation = useResendVerification();
  const isLoading = resendVerificationMutation.isPending;

  const [expiredDate, setExpiredDate] = useState<number>(() => {
    const storedDate = localStorage.getItem(keyLocalStorage.EXPIRED_SIGN_UP_TIME);
    return storedDate ? new Date(Number(storedDate)).getTime() : 0;
  });

  const { left, isEnd } = useCountdownTimer(expiredDate ? new Date(expiredDate).getTime() : 0);
  const formatTime = formatDuration(left);

  const handleClickResend = async () => {
    if (!email) return;
    await resendVerificationMutation.mutateAsync({ email: email! });
    const newExpiredDate = addMinutes(new Date(), 5);
    const newExpiredTimestamp = newExpiredDate.getTime();
    setLocalStorageItem(keyLocalStorage.EXPIRED_SIGN_UP_TIME, `${newExpiredTimestamp}`);
    setExpiredDate(newExpiredTimestamp);
    toast.success(t('messages.resend-verification-success', { ns: 'common' }));
  };

  useEffect(() => {
    const storedDate = localStorage.getItem(keyLocalStorage.EXPIRED_SIGN_UP_TIME);
    if (storedDate) {
      const expiredDateObj = new Date(Number(storedDate));
      if (isAfter(new Date(), expiredDateObj)) {
        localStorage.removeItem(keyLocalStorage.EXPIRED_SIGN_UP_TIME);
        setExpiredDate(0);
      }
    }
  }, []);

  return {
    t,
    formatTime,
    isEnd,
    isLoading,
    handleClickResend,
  };
};
