import { useGetMerchantList, type IMerchant } from '@/apis/merchants';
import { PAGE_SIZE_OPTIONS } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import { Route } from '@/routes/(private)/merchants';
import type { SortingState } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';

export const useMerchantContainer = () => {
  const { t } = useTranslation('merchants-page');
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const [editingMerchant, setEditingMerchant] = useState<IMerchant | undefined>(undefined);
  const [actionType, setActionType] = useState<null | 'create' | 'inactive' | 'active'>(null);
  const [, setSorting] = useState<SortingState>([]);

  const filters = {
    page: search.page,
    pageSize: search.pageSize,
    sortBy: search.sortBy,
    sortOrder: search.sortOrder,
    search: search.search,
    status: search.status,
  };
  const { data, isFetching, isLoading, refetch } = useGetMerchantList(filters);

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
          sortOrder: updatedSorting[0].desc ? 'desc' : 'asc',
        },
        replace: true,
      });
    } else {
      navigate({
        search: {
          ...search,
          sortOrder: 'desc',
          sortBy: 'createdAt',
        },
        replace: true,
      });
    }
  };

  const onAction = useCallback((merchant: IMerchant, actionType: 'create' | 'inactive' | 'active') => {
    setEditingMerchant(merchant);
    setActionType(actionType);
  }, []);

  const onClose = useCallback(() => {
    setEditingMerchant(undefined);
    setActionType(null);
  }, []);

  const onCreate = () => {
    setEditingMerchant(undefined);
    setActionType('create');
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

  return {
    t,
    isLoading,
    isFetching,
    tableData,
    editingMerchant,
    actionType,
    onAction,
    onRefetch,
    onPaginationChange,
    onSortingChange,
    onClose,
    onCreate,
  };
};
