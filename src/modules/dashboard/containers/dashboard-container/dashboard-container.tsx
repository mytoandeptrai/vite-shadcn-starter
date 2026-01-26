import { PageContainer } from '@/components/containers';
import { useTranslation } from '@/integrations/i18n';
import { DemoForm } from '@/modules/demo-form/components/demo-form';

const DashboardContainer = () => {
  const { t } = useTranslation('dashboard-page');
  return (
    <PageContainer pageTitle={t('title')}>
      <div className='space-y-6'>
        <DemoForm />
      </div>
    </PageContainer>
  );
};

export default DashboardContainer;
