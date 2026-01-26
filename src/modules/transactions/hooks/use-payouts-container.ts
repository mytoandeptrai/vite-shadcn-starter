import { useGetTransactionList, type ITransaction } from '@/apis/transactions';
import { BASE_REFRESH_INTERVAL, PAGE_SIZE_OPTIONS, ROUTES } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import { Route } from '@/routes/(private)/transactions';
import { filterBooleanArray } from '@/utils';
import type { SortingState } from '@tanstack/react-table';
import { useMemo } from 'react';

export const usePayoutsContainer = () => {
  const { t } = useTranslation('transactions-page');
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const filters = {
    page: search.page,
    pageSize: search.pageSize,
    sortBy: search.sortBy,
    orderBy: search.orderBy,
    search: search.search,
    type: ['PAYOUT'],
    status: filterBooleanArray(search.status),
    chain: filterBooleanArray(search.chain),
    crypto: filterBooleanArray(search.crypto),
    network: filterBooleanArray(search.network),
    fromDate: search.fromDate,
    toDate: search.toDate,
  };

  const { data, isFetching, isLoading, refetch } = useGetTransactionList(filters, {
    refetchInterval: BASE_REFRESH_INTERVAL,
    placeholderData: (prev) => prev,
  });

  const onPaginationChange = (page: number, pageSize: number, action: 'pagination' | 'limiting') => {
    navigate({
      search: {
        ...search,
        page: action === 'pagination' ? page : 1,
        pageSize: pageSize,
      },
      replace: true,
    });
  };

  const onSortingChange = (updatedSorting: SortingState) => {
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
          sortBy: 'updatedAt',
        },
        replace: true,
      });
    }
  };

  const onRowClick = (e: React.MouseEvent<HTMLTableRowElement>, row: ITransaction) => {
    e.preventDefault();
    navigate({
      to: ROUTES.TRANSACTION_DETAIL,
      params: {
        transactionId: row.id.toString(),
      },
    });
  };

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

  return {
    t,
    isLoading,
    isFetching,
    tableData,
    onPaginationChange,
    onSortingChange,
    onRowClick,
    refetch,
  };
};
