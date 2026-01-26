import { useAllActivityContainer } from '../../hooks';
import TransactionTableContainer from '../transaction-table-container';

const AllActivityContainer = () => {
  const { isLoading, isFetching, tableData, onPaginationChange, onSortingChange, onRowClick } = useAllActivityContainer();

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

export default AllActivityContainer;
