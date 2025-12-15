import { PageContainer } from '@/components/containers';
import BalanceSectionUi from '../../components/balance-section-ui/balance-section-ui';
import { useBalanceContainer } from '../../hooks';
import { Show } from '@/components/utilities';
import BalanceWithDrawUi from '../../components/balance-withdraw-ui';
import BalanceSelectUi from '../../components/balance-select-ui';

const BalanceContainer = () => {
  const {
    t,
    balance,
    incomingBalance,
    isOpenDialog,
    tokenOptions,
    selectedToken,
    onSelectToken,
    onCloseDialog,
    onOpenDialog,
  } = useBalanceContainer();
  return (
    <PageContainer
      pageTitle={t('title')}
      pageDescription={t('description')}
      pageHeaderAction={
        <div className='py-2'>
          <BalanceSelectUi selectedValue={selectedToken} onSelect={onSelectToken} options={tokenOptions} />
        </div>
      }
    >
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <BalanceSectionUi
          title={t('labels.available-balance')}
          description={t('labels.ready-to-withdraw')}
          amount={balance}
          type='available'
          onClick={onOpenDialog}
        />
        <BalanceSectionUi
          title={t('labels.incoming-balance')}
          description={t('labels.processing-transactions')}
          amount={incomingBalance}
          type='incoming'
        />
      </div>
      <Show when={isOpenDialog}>
        <BalanceWithDrawUi selectedToken={selectedToken} open={isOpenDialog} onClose={onCloseDialog} max={balance} />
      </Show>
    </PageContainer>
  );
};

export default BalanceContainer;
