import { PageContainer } from '@/components/containers';
import { useTranslation } from '@/integrations/i18n';
import SystemLanguageUi from '../../components/system-language-ui';
import SystemTwoFaContainer from '../system-two-fa-container';

const SystemContainer = () => {
  const { t } = useTranslation('settings-page');
  return (
    <PageContainer pageTitle={t('system.title')} pageDescription={t('system.description')}>
      <div className='space-y-6'>
        <SystemLanguageUi />
        <SystemTwoFaContainer />
      </div>
    </PageContainer>
  );
};

export default SystemContainer;
