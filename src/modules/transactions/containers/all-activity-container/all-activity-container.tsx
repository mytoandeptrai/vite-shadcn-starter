import { useAllActivityContainer } from '../../hooks';
import TransactionTableContainer from '../transaction-table-container';

const AllActivityContainer = () => {
  const {
    isLoading,
    isFetching,
    tableData,
    searchValue,
    onPaginationChange,
    onSortingChange,
    onSearchValueChange,
  } = useAllActivityContainer();

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

export default AllActivityContainer;
