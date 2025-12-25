import { PageContainer } from '@/components/containers';
import { useTransactionDetailContainer } from '../../hooks';
import TransactionDetailOverviewUi from '../../components/transaction-detail-overview-ui';
import TransactionDetailBlockchainUi from '../../components/transaction-detail-blockchain-ui';
import TransactionDetailRawUi from '../../components/transaction-detail-raw-ui';
import TransactionDetailTimelineUi from '../../components/transaction-detail-timeline-ui';

const TransactionDetailContainer = () => {
  const { t, transactionId, transaction, isLoading, error } = useTransactionDetailContainer();
  return (
    <PageContainer
      pageTitle={t('title', { transactionId })}
      pageDescription={t('description')}
      isLoading={isLoading}
      errorMessage={error?.message}
    >
      <div className='space-y-6'>
        <TransactionDetailOverviewUi transaction={transaction} />
        <TransactionDetailBlockchainUi transaction={transaction} />
        <TransactionDetailTimelineUi transaction={transaction} />
        <TransactionDetailRawUi transaction={transaction} />
      </div>
    </PageContainer>
  );
};

export default TransactionDetailContainer;
