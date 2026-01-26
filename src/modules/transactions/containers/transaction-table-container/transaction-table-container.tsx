import type { ITransaction } from '@/apis/transactions';
import { DataTable } from '@/components/ui/data-table';
import { useTranslation } from '@/integrations/i18n';
import type { SortingState } from '@tanstack/react-table';
import { useMemo } from 'react';
import TableFilterContainer from '../table-filter-container';
import { createColumns } from './create-columns';

export type TransactionTableContainerProps = {
  onPaginationChange?: (page: number, pageSize: number, action: 'pagination' | 'limiting') => void;
  onSortingChange: (updatedSorting: SortingState) => void;
  onRowClick?: (e: React.MouseEvent<HTMLTableRowElement>, row: ITransaction) => void;
  isLoading: boolean;
  isFetching: boolean;
  tableData: {
    data: ITransaction[];
    pagination: {
      pageIndex: number;
      pageSize: number;
      pageCount: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  searchValue?: string;
};

const TransactionTableContainer = ({
  isLoading,
  isFetching,
  tableData,
  onPaginationChange,
  onSortingChange,
  onRowClick,
}: TransactionTableContainerProps) => {
  const { t } = useTranslation('transactions-page');
  const columns = useMemo(() => createColumns({ t }), [t]);

  return (
    <DataTable
      columns={columns}
      data={tableData.data}
      pagination={tableData.pagination}
      isInitialLoading={isLoading}
      isDataFetching={isFetching}
      onPaginationChange={onPaginationChange}
      onSortingChange={onSortingChange}
      onRowClick={onRowClick}
    >
      <TableFilterContainer />
    </DataTable>
  );
};

export default TransactionTableContainer;
