import { PageContainer } from '@/components/containers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/integrations/i18n';
import { Route } from '@/routes/(private)/transactions';
import AllActivityContainer from '../all-activity-container';
import PaymentsContainer from '../payments-container';
import PayoutsContainer from '../payouts-container';
import { PAGE_SIZE_OPTIONS } from '@/constant';

const TransactionContainer = () => {
  const { t } = useTranslation('transactions-page');
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const activeTab = search.tab ?? 'payments';

  const handleTabChange = (value: string) => {
    navigate({
      search: () => ({
        tab: value as 'payments' | 'payouts' | 'all',
        page: 1,
        pageSize: PAGE_SIZE_OPTIONS[0],
        sortBy: 'updatedAt',
        orderBy: 'desc',
        search: undefined,
        status: undefined,
        type: value === 'all' ? ['PAYMENT', 'PAYOUT'] : undefined,
        fromDate: undefined,
        toDate: undefined,
        chain: undefined,
        crypto: undefined,
        network: undefined,
      }),
      replace: true,
    });
  };

  return (
    <PageContainer pageTitle={t('title')} pageDescription={t('description')}>
      <div className='space-y-6'>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value='payments'>{t('tabs.payments')}</TabsTrigger>
            <TabsTrigger value='payouts'>{t('tabs.payouts')}</TabsTrigger>
            <TabsTrigger value='all'>{t('tabs.allActivity')}</TabsTrigger>
          </TabsList>
          <TabsContent value='payments'>
            <PaymentsContainer />
          </TabsContent>
          <TabsContent value='payouts'>
            <PayoutsContainer />
          </TabsContent>
          <TabsContent value='all'>
            <AllActivityContainer />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default TransactionContainer;
