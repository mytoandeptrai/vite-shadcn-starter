import { Paragraph } from '@/components/ui/typography';
import { useTranslation } from '@/integrations/i18n';

import AppstoreIcon from '@/assets/icons/appstore-icon.svg?react';
import CHPlayIcon from '@/assets/icons/chplay-icon.svg?react';
import { GOOGLE_AUTHENTICATOR_APP_STORE_URL, GOOGLE_AUTHENTICATOR_CH_PLAY_URL } from '../../../hooks';

const SystemTwoFaStep1Ui = () => {
  const { t } = useTranslation('settings-page');
  return (
    <div>
      <div className='flex flex-col gap-2'>
        <Paragraph className='text-sm'>{t('system.labels.two-fa.labels.instruction1')}</Paragraph>
        <div className='flex justify-center gap-2'>
          <CHPlayIcon
            width={156}
            height={48}
            onClick={() => window.open(GOOGLE_AUTHENTICATOR_CH_PLAY_URL, '_blank')}
            style={{ cursor: 'pointer' }}
          />
          <AppstoreIcon
            width={156}
            height={48}
            onClick={() => window.open(GOOGLE_AUTHENTICATOR_APP_STORE_URL, '_blank')}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </div>
    </div>
  );
};

export default SystemTwoFaStep1Ui;
