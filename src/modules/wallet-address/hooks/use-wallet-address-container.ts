import { useGetWalletAddressList, type IWalletAddress } from '@/apis/wallet-address';
import { PAGE_SIZE_OPTIONS } from '@/constant';
import { useAuthContext } from '@/integrations/auth/auth-provider';
import { useTranslation } from '@/integrations/i18n';
import { Route } from '@/routes/(private)/wallet-address';
import type { SortingState } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useWalletAddressContainer = () => {
  const { t } = useTranslation('wallet-address-page');
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { onRefetch: onRefetchUser } = useAuthContext();

  const [editingWalletAddress, setEditingWalletAddress] = useState<IWalletAddress | undefined>(undefined);
  const [actionType, setActionType] = useState<null | 'create' | 'update' | 'delete' | 'activate' | 'deactivate'>(null);
  const [, setSorting] = useState<SortingState>([]);

  const filters = {
    page: search.page,
    pageSize: search.pageSize,
    sortBy: search.sortBy,
    orderBy: search.orderBy,
    search: search.search,
    chain: search.chain ? search.chain.filter((el) => Boolean(el)) : [],
    crypto: search.crypto ? search.crypto.filter((el) => Boolean(el)) : [],
  };
  const { data, isFetching, isLoading, refetch } = useGetWalletAddressList(filters);

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
          orderBy: updatedSorting[0].desc ? 'desc' : 'asc',
        },
        replace: true,
      });
    } else {
      navigate({
        search: {
          ...search,
          orderBy: 'desc',
          sortBy: 'createdAt',
        },
        replace: true,
      });
    }
  };

  const onAction = (
    walletAddress: IWalletAddress,
    actionType: 'activate' | 'deactivate' | 'delete' | 'update' | 'create'
  ) => {
    setEditingWalletAddress(walletAddress);
    setActionType(actionType);
  };

  const onClose = useCallback(() => {
    setEditingWalletAddress(undefined);
    setActionType(null);
  }, []);

  const onCreate = () => {
    setEditingWalletAddress(undefined);
    setActionType('create');
  };

  const onRefetch = useCallback(() => {
    onClose();
    refetch();
    onRefetchUser();
  }, [refetch, onClose, onRefetchUser]);

  const tableData = useMemo(() => {
    return {
      data: data?.data ?? [],
      pagination: {
        pageIndex: data?.pagination.page ?? 1,
        pageSize: data?.pagination.pageSize ?? PAGE_SIZE_OPTIONS[0],
        pageCount: data?.pagination.totalPages ?? 0,
        hasNext: data?.pagination.hasNext ?? false,
        hasPrev: data?.pagination.hasPrev ?? false,
      },
    };
  }, [data]);

  useEffect(() => {
    if (search.forceAddWallet) {
      setEditingWalletAddress(undefined);
      setActionType('create');
    }
  }, [search.forceAddWallet]);

  return {
    t,
    isFetching,
    isLoading,
    tableData,
    editingWalletAddress,
    actionType,
    onRefetch,
    onPaginationChange,
    onSortingChange,
    onAction,
    onClose,
    onCreate,
  };
};
