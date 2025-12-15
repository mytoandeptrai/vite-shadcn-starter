import type { IWalletAddress } from "@/apis/wallet-address";
import { DataTable } from "@/components/ui/data-table";
import { useTranslation } from "@/integrations/i18n";
import type { SortingState } from "@tanstack/react-table";
import { useMemo } from "react";
import { createColumns } from "./create-columns";

export type WalletAddressTableContainerProps = {
  onPaginationChange: (page: number, pageSize: number) => void;
  onSortingChange: (updatedSorting: SortingState) => void;
  onEdit: (walletAddress: IWalletAddress) => void;
  onDelete: (walletAddress: IWalletAddress) => void;
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
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
};

const WalletAddressTableContainer = ({
  isLoading,
  isFetching,
  tableData,
  onPaginationChange,
  onSortingChange,
  onEdit,
  onDelete,
  searchValue,
  onSearchValueChange,
}: WalletAddressTableContainerProps) => {
  const { t } = useTranslation("wallet-address-page");
  const columns = useMemo(
    () => createColumns({ t, onEdit, onDelete }),
    [t, onEdit, onDelete]
  );

  return (
    <DataTable
      searchKey="address"
      searchValue={searchValue}
      onSearchValueChange={onSearchValueChange}
      columns={columns}
      data={tableData.data}
      pagination={tableData.pagination}
      isInitialLoading={isLoading}
      isDataFetching={isFetching}
      onPaginationChange={onPaginationChange}
      onSortingChange={onSortingChange}
    />
  );
};

export default WalletAddressTableContainer;
