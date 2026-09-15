import { PageContainer } from '@/components/containers';
import { useTranslation } from '@/integrations/i18n';
import { DemoForm } from '@/modules/demo-form/components/demo-form';
import { DemoTable } from '@/modules/demo-form/components/demo-table';

const DashboardContainer = () => {
  const { t } = useTranslation('dashboard-page');
  return (
    <PageContainer pageTitle={t('title')}>
      <div className='space-y-6'>
        <DemoTable />
        <DemoForm />
      </div>
    </PageContainer>
  );
};

export default DashboardContainer;
