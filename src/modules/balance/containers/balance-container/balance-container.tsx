import { PageContainer } from '@/components/containers';
import BalanceSectionUi from '../../components/balance-section-ui/balance-section-ui';
import { useBalanceContainer } from '../../hooks';
import { Show } from '@/components/utilities';
import BalanceWithDrawUi from '../../components/balance-withdraw-ui';
import BalanceSelectUi from '../../components/balance-select-ui';

const BalanceContainer = () => {
  const {
    t,
    tokenOptions,
    selectedToken,
    balanceAvailable,
    balanceIncoming,
    isOpenDialog,
    walletTokenOptions,
    isLoading,
    exchangeRate,
    onCloseDialog,
    onOpenDialog,
    onSelectToken,
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
          type='available'
          amount={balanceAvailable}
          selectedToken={selectedToken}
          isLoading={isLoading}
          exchangeRate={exchangeRate}
          onClick={onOpenDialog}
        />
        <BalanceSectionUi
          title={t('labels.incoming-balance')}
          description={t('labels.processing-transactions')}
          type='incoming'
          selectedToken={selectedToken}
          amount={balanceIncoming}
          isLoading={isLoading}
          exchangeRate={exchangeRate}
        />
      </div>
      <Show when={isOpenDialog}>
        <BalanceWithDrawUi
          walletTokenOptions={walletTokenOptions}
          selectedToken={selectedToken}
          open={isOpenDialog}
          max={balanceAvailable}
          onClose={onCloseDialog}
        />
      </Show>
    </PageContainer>
  );
};

export default BalanceContainer;
