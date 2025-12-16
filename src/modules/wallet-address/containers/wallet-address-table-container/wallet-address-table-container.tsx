import type { IWalletAddress } from '@/apis/wallet-address';
import { DataTable } from '@/components/ui/data-table';
import { useTranslation } from '@/integrations/i18n';
import type { SortingState } from '@tanstack/react-table';
import { useMemo } from 'react';
import { createColumns } from './create-columns';
import TableFilterContainer from '../table-filter-container';

export type WalletAddressTableContainerProps = {
  onPaginationChange: (page: number, pageSize: number) => void;
  onSortingChange: (updatedSorting: SortingState) => void;
  onAction: (
    walletAddress: IWalletAddress,
    actionType: 'activate' | 'deactivate' | 'delete' | 'update' | 'create'
  ) => void;
  isLoading: boolean;
  isFetching: boolean;
  tableData: {
    data: IWalletAddress[];
    pagination: {
      pageIndex: number;
      pageSize: number;
      pageCount: number;
    };
  };
};

const WalletAddressTableContainer = ({
  isLoading,
  isFetching,
  tableData,
  onPaginationChange,
  onSortingChange,
  onAction,
}: WalletAddressTableContainerProps) => {
  const { t } = useTranslation('wallet-address-page');
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

export default WalletAddressTableContainer;
