import { PageContainer } from '@/components/containers';
import { Button } from '@/components/ui/button';
import { useWalletAddressContainer } from '../../hooks';
import WalletAddressFormContainer from '../wallet-address-form-container';
import WalletAddressTableContainer from '../wallet-address-table-container';

const WalletAddressContainer = () => {
  const {
    t,
    isFetching,
    isLoading,
    tableData,
    editingWalletAddress,
    actionType,
    onRefetch,
    onPaginationChange,
    onSortingChange,
    onClose,
    onCreate,
    onAction,
  } = useWalletAddressContainer();
  return (
    <PageContainer pageTitle={t('title')} pageDescription={t('description')}>
      <div className='space-y-6'>
        <Button type='button' size='lg' onClick={onCreate}>
          {t('actions.add')}
        </Button>
        <WalletAddressTableContainer
          tableData={tableData}
          isLoading={isLoading}
          isFetching={isFetching}
          onPaginationChange={onPaginationChange}
          onSortingChange={onSortingChange}
          onAction={onAction}
        />
        <WalletAddressFormContainer
          open={!!actionType}
          onClose={onClose}
          onSuccess={onRefetch}
          initialData={editingWalletAddress || undefined}
          actionType={actionType}
        />
      </div>
    </PageContainer>
  );
};

export default WalletAddressContainer;
