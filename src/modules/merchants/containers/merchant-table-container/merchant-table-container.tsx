import type { IMerchant } from '@/apis/merchants';
import { DataTable } from '@/components/ui/data-table';
import { useTranslation } from '@/integrations/i18n';
import type { SortingState } from '@tanstack/react-table';
import { useMemo } from 'react';
import { createColumns } from './create-columns';
import TableFilterContainer from '../table-filter-container';

export type MerchantTableContainerProps = {
  onPaginationChange: (page: number, pageSize: number) => void;
  onSortingChange: (updatedSorting: SortingState) => void;
  onAction: (merchant: IMerchant, actionType: 'create' | 'active' | 'inactive') => void;
  isLoading: boolean;
  isFetching: boolean;
  tableData: {
    data: IMerchant[];
    pagination: {
      pageIndex: number;
      pageSize: number;
      pageCount: number;
    };
  };
};

const MerchantTableContainer = ({
  isLoading,
  isFetching,
  tableData,
  onPaginationChange,
  onSortingChange,
  onAction,
}: MerchantTableContainerProps) => {
  const { t } = useTranslation('merchants-page');

  const columns = useMemo(() => createColumns({ t, onAction }), [t, onAction]);

  return (
    <DataTable
      columns={columns}
      data={tableData.data}
      pagination={tableData.pagination}
      isInitialLoading={isLoading}
      isDataFetching={isFetching}
      onPaginationChange={onPaginationChange}
      onSortingChange={onSortingChange}
    >
      <TableFilterContainer />
    </DataTable>
  );
};

export default MerchantTableContainer;
