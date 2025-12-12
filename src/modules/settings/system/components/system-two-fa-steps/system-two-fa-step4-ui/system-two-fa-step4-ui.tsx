import { Paragraph } from '@/components/ui/typography';
import { useTranslation } from '@/integrations/i18n';
import CircledCheckIcon2 from '@/assets/icons/circled-check-icon2.svg?react';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '@/constant';

const SystemTwoFaStep4Ui = () => {
  const { t } = useTranslation('settings-page');
  const navigate = useNavigate();

  const onSignOut = useCallback(async () => {
    /** Signout */
    navigate({
      to: ROUTES.LOGIN,
    });
  }, [navigate]);

  useEffect(() => {
    (async () => {
      toast.success(t('system.labels.two-fa.labels.step4-message'));
      setTimeout(() => {
        onSignOut();
      }, 3000);
    })();
  }, [t, onSignOut]);

  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <CircledCheckIcon2 width={56} height={56} />
      <Paragraph className='text-center text-sm'>{t('system.labels.two-fa.labels.step4-message')}</Paragraph>
    </div>
  );
};

export default SystemTwoFaStep4Ui;
