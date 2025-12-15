import { useGetTransactionList } from "@/apis/transactions";
import { PAGE_SIZE_OPTIONS } from "@/constant";
import { useTranslation } from "@/integrations/i18n";
import { Route } from "@/routes/(public)/transactions";
import type { SortingState } from "@tanstack/react-table";
import { useMemo } from "react";

export const usePayoutsContainer = () => {
  const { t } = useTranslation("transactions-page");
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const filters = {
    page: search.page,
    pageSize: search.pageSize,
    sortBy: search.sortBy,
    sortOrder: search.sortOrder,
    search: search.search,
    type: search.type ? search.type.filter((el) => Boolean(el)) : [],
    status: search.status ? search.status.filter((el) => Boolean(el)) : [],
    dateFrom: search.dateFrom,
    dateTo: search.dateTo,
  };

  const { data, isFetching, isLoading, refetch } =
    useGetTransactionList(filters);

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
    onPaginationChange,
    onSortingChange,
    refetch,
  };
};
