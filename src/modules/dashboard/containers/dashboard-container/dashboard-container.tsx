import { PageContainer } from '@/components/containers';
import DashboardStartContainer from '../dashboard-start-container';
import { useTranslation } from '@/integrations/i18n';
import DashboardBalanceContainer from '../dashboard-balance-container';
import DashboardSummaryContainers from '../dashboard-summary-containers';
import DashboardApiContainer from '../dashboard-api-container';

const DashboardContainer = () => {
  const { t } = useTranslation('dashboard-page');
  return (
    <PageContainer pageTitle={t('title')}>
      <div className='space-y-6'>
        <DashboardStartContainer />
        <DashboardBalanceContainer />
        <DashboardSummaryContainers />
        <DashboardApiContainer />
      </div>
    </PageContainer>
  );
};

export default DashboardContainer;
