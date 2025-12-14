import { usePaymentsContainer } from '../../hooks';
import TransactionTableContainer from '../transaction-table-container';

const PaymentsContainer = () => {
  const {
    isLoading,
    isFetching,
    tableData,
    searchValue,
    onPaginationChange,
    onSortingChange,
    onSearchValueChange,
  } = usePaymentsContainer();

  return (
    <TransactionTableContainer
      tableData={tableData}
      isLoading={isLoading}
      isFetching={isFetching}
      onPaginationChange={onPaginationChange}
      onSortingChange={onSortingChange}
      searchValue={searchValue}
      onSearchValueChange={onSearchValueChange}
    />
  );
};

export default PaymentsContainer;
