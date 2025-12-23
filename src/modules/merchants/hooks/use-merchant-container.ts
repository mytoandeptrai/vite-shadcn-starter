import {
  useGetMarketplaceMerchantsList,
  type IMerchant,
} from "@/apis/marketplace";
import { PAGE_SIZE_OPTIONS } from "@/constant";
import { useTranslation } from "@/integrations/i18n";
import { Route } from "@/routes/(private)/merchants";
import type { SortingState } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";

export type ActionType =
  | "create"
  | "inactive"
  | "active"
  | "view"
  | "delete"
  | "update"
  | null;

export const useMerchantContainer = () => {
  const { t } = useTranslation("merchants-page");
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const [editingMerchant, setEditingMerchant] = useState<IMerchant | undefined>(
    undefined
  );
  const [actionType, setActionType] = useState<ActionType>(null);
  const [, setSorting] = useState<SortingState>([]);

  const filters = {
    page: search.page,
    pageSize: search.pageSize,
    sortBy: search.sortBy,
    orderBy: search.orderBy,
    search: search.search,
    status: search.status,
  };
  const { data, isFetching, isLoading, refetch } =
    useGetMarketplaceMerchantsList(filters);

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
          orderBy: updatedSorting[0].desc ? "desc" : "asc",
        },
        replace: true,
      });
    } else {
      navigate({
        search: {
          ...search,
          orderBy: "desc",
          sortBy: "created_at",
        },
        replace: true,
      });
    }
  };

  const onAction = useCallback(
    (merchant: IMerchant, actionType: ActionType) => {
      setEditingMerchant(merchant);
      setActionType(actionType);
    },
    []
  );

  const onClose = useCallback(() => {
    setEditingMerchant(undefined);
    setActionType(null);
  }, []);

  const onCreate = () => {
    setEditingMerchant(undefined);
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
        pageIndex: data?.pagination.page ?? 1,
        pageSize: data?.pagination.pageSize ?? PAGE_SIZE_OPTIONS[0],
        hasNext: data?.pagination.hasNext ?? false,
        hasPrev: data?.pagination.hasPrev ?? false,
        pageCount: data?.pagination.totalPages ?? 0,
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
