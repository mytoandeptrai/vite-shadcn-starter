import { PageContainer } from '@/components/containers';
import { Button } from '@/components/ui/button';
import { useMerchantContainer } from '../../hooks';
import MerchantFormContainer from '../merchant-form-container';
import MerchantTableContainer from '../merchant-table-container';

const MerchantContainer = () => {
  const {
    t,
    isFetching,
    isLoading,
    tableData,
    editingMerchant,
    actionType,
    onRefetch,
    onPaginationChange,
    onSortingChange,
    onAction,
    onClose,
    onCreate,
  } = useMerchantContainer();

  return (
    <PageContainer pageTitle={t('title')} pageDescription={t('description')}>
      <div className='space-y-6'>
        <Button type='button' size='lg' onClick={onCreate}>
          {t('actions.add')}
        </Button>
        <MerchantTableContainer
          tableData={tableData}
          isLoading={isLoading}
          isFetching={isFetching}
          onPaginationChange={onPaginationChange}
          onSortingChange={onSortingChange}
          onAction={onAction}
        />
        <MerchantFormContainer
          open={!!actionType}
          onClose={onClose}
          onSuccess={onRefetch}
          initialData={editingMerchant || undefined}
          actionType={actionType}
        />
      </div>
    </PageContainer>
  );
};

export default MerchantContainer;
