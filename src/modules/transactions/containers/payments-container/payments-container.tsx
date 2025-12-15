import { usePaymentsContainer } from "../../hooks";
import TransactionTableContainer from "../transaction-table-container";

const PaymentsContainer = () => {
  const {
    isLoading,
    isFetching,
    tableData,
    onPaginationChange,
    onSortingChange,
  } = usePaymentsContainer();

  return (
    <TransactionTableContainer
      tableData={tableData}
      isLoading={isLoading}
      isFetching={isFetching}
      onPaginationChange={onPaginationChange}
      onSortingChange={onSortingChange}
    />
  );
};

export default PaymentsContainer;
