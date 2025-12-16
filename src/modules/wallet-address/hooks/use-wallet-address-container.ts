import {
  useGetWalletAddressList,
  type IWalletAddress,
} from "@/apis/wallet-address";
import { PAGE_SIZE_OPTIONS } from "@/constant";
import { useTranslation } from "@/integrations/i18n";
import { Route } from "@/routes/(public)/wallet-address";
import type { SortingState } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";

export const useWalletAddressContainer = () => {
  const { t } = useTranslation("wallet-address-page");
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const [editingWalletAddress, setEditingWalletAddress] = useState<
    IWalletAddress | undefined
  >(undefined);
  const [actionType, setActionType] = useState<
    null | "create" | "update" | "delete"
  >(null);
  const [, setSorting] = useState<SortingState>([]);

  /** TODO: Request API with filters */
  const filters = {
    page: search.page,
    pageSize: search.pageSize,
    sortBy: search.sortBy,
    sortOrder: search.sortOrder,
    search: search.search,
    blockChain: search.blockChain ? search.blockChain.filter((el) => Boolean(el)) : [],
  };
  const { data, isFetching, isLoading, refetch } =
    useGetWalletAddressList(filters);

  const onPaginationChange = (page: number, pageSize: number) => {
    navigate({
      search: {
        ...search,
        page: page,
        pageSize: pageSize,
      },
      replace: true,
    });
  };

  const onSortingChange = (updatedSorting: SortingState) => {
    setSorting(updatedSorting);

    if (updatedSorting.length > 0) {
      navigate({
        search: {
          ...search,
          sortBy: updatedSorting[0].id,
          sortOrder: updatedSorting[0].desc ? "desc" : "asc",
        },
        replace: true,
      });
    } else {
      navigate({
        search: {
          ...search,
          sortOrder: "desc",
          sortBy: "createdAt",
        },
        replace: true,
      });
    }
  };

  const onSearchValueChange = (val: string) => {
    navigate({
      search: {
        ...search,
        search: val,
        page: 1,
      },
      replace: true,
    });
  };

  const onEdit = (walletAddress: IWalletAddress) => {
    setEditingWalletAddress(walletAddress);
    setActionType("update");
  };

  const onDelete = (walletAddress: IWalletAddress) => {
    setEditingWalletAddress(walletAddress);
    setActionType("delete");
  };

  const onClose = useCallback(() => {
    setEditingWalletAddress(undefined);
    setActionType(null);
  }, []);

  const onCreate = () => {
    setEditingWalletAddress(undefined);
    setActionType("create");
  };

  const onRefetch = useCallback(() => {
    onClose();
    refetch();
  }, [refetch, onClose]);

  const tableData = useMemo(() => {
    return {
      data: data?.data ?? [],
      pagination: {
        pageIndex: data?.page ?? 1,
        pageSize: data?.totalCount ?? PAGE_SIZE_OPTIONS[0],
        pageCount: data?.totalPage ?? 0,
      },
    };
  }, [data]);

  useEffect(() => {
    if (search.forceAddWallet) {
      onCreate();
    }
  }, [search.forceAddWallet]);

  return {
    t,
    isLoading,
    isFetching,
    tableData,
    editingWalletAddress,
    actionType,
    searchValue: search.search,
    onRefetch,
    onPaginationChange,
    onSortingChange,
    onSearchValueChange,
    onEdit,
    onDelete,
    onClose,
    onCreate,
  };
};
