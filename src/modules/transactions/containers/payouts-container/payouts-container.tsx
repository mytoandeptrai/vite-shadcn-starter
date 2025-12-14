import { usePayoutsContainer } from '../../hooks';
import TransactionTableContainer from '../transaction-table-container';

const PayoutsContainer = () => {
  const {
    isLoading,
    isFetching,
    tableData,
    searchValue,
    onPaginationChange,
    onSortingChange,
    onSearchValueChange,
  } = usePayoutsContainer();

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

export default PayoutsContainer;
