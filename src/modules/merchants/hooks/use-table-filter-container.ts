import { useTranslation } from "@/integrations/i18n";
import { Route } from "@/routes/(public)/merchants";
import type { Option } from "@/types";
import type { TFunction } from "i18next";
import { useMemo } from "react";

const STATUS_OPTIONS = (t: TFunction): Option<string>[] => [
  { label: t("status.active"), value: "active" },
  { label: t("status.inactive"), value: "inactive" },
];

export const useTableFilterContainer = () => {
  const { t } = useTranslation("merchants-page");
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const options = useMemo(
    () => ({
      status: STATUS_OPTIONS(t),
    }),
    [t]
  );

  const onSearchValueChange = (value: string) => {
    navigate({
      search: { ...search, search: value, page: 1 },
      replace: true,
    });
  };

  const onStatusChange = (status?: string[]) => {
    navigate({
      search: { 
        ...search, 
        status: status && status.length > 0 ? status.filter((el) => Boolean(el)) : undefined, 
        page: 1 
      },
      replace: true,
    });
  };

  return {
    t,
    options,
    searchValue: search.search,
    selectedStatus: search.status,
    onSearchValueChange,
    onStatusChange,
  };
};
