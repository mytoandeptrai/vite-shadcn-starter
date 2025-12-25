import { usePaymentsContainer } from '../../hooks';
import TransactionTableContainer from '../transaction-table-container';

const PaymentsContainer = () => {
  const { isLoading, isFetching, tableData, onPaginationChange, onSortingChange, onRowClick } = usePaymentsContainer();

  return (
    <TransactionTableContainer
      tableData={tableData}
      isLoading={isLoading}
      isFetching={isFetching}
      onPaginationChange={onPaginationChange}
      onSortingChange={onSortingChange}
      onRowClick={onRowClick}
    />
  );
};

export default PaymentsContainer;
