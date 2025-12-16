import { useTranslation } from "@/integrations/i18n";
import { Route } from "@/routes/(public)/wallet-address";
import type { Option } from "@/types";
import type { TFunction } from "i18next";
import { useMemo } from "react";
const BLOCKCHAIN_OPTIONS = (t: TFunction): Option<string>[] => [
  { label: t("chains.ALL", { ns: "common" }), value: "" },
  { label: t("chains.ETH", { ns: "common" }), value: "eth" },
  { label: t("chains.BNB", { ns: "common" }), value: "bnb" },
];

export const useTableFilterContainer = () => {
  const { t } = useTranslation("wallet-address-page");
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const options = useMemo(
    () => ({
      blockChain: BLOCKCHAIN_OPTIONS(t),
    }),
    [t]
  );

  const onSearchValueChange = (value: string) => {
    navigate({
      search: { ...search, search: value },
      replace: true,
    });
  };

  const onBlockChainValueChange = (blockChain?: string[]) => {
    navigate({
      search: { ...search, blockChain: blockChain ?? undefined },
      replace: true,
    });
  };

  return {
    t,
    options,
    searchValue: search.search,
    selectedBlockChain: search.blockChain,
    onSearchValueChange,
    onBlockChainValueChange,
  };
};
