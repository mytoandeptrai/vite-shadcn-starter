import { usePayoutsContainer } from '../../hooks';
import TransactionTableContainer from '../transaction-table-container';

const PayoutsContainer = () => {
  const { isLoading, isFetching, tableData, onPaginationChange, onSortingChange, onRowClick } = usePayoutsContainer();

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

export default PayoutsContainer;
