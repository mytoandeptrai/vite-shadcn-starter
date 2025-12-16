import { useTranslation } from "@/integrations/i18n";
import { Route } from "@/routes/(public)/wallet-address";
import type { Option } from "@/types";
import type { TFunction } from "i18next";
import { useMemo } from "react";
const CHAIN_OPTIONS = (t: TFunction): Option<string>[] => [
  { label: t("chains.ETH", { ns: "common" }), value: "eth" },
  { label: t("chains.BNB", { ns: "common" }), value: "bnb" },
];

export const useTableFilterContainer = () => {
  const { t } = useTranslation("wallet-address-page");
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const options = useMemo(
    () => ({
      chain: CHAIN_OPTIONS(t),
    }),
    [t]
  );

  const onSearchValueChange = (value: string) => {
    navigate({
      search: { ...search, search: value },
      replace: true,
    });
  };

  const onChainValueChange = (chain?: string[]) => {
    navigate({
      search: { ...search, chain: chain ?? undefined },
      replace: true,
    });
  };

  return {
    t,
    options,
    searchValue: search.search,
    selectedChain: search.chain,
    onSearchValueChange,
    onChainValueChange,
  };
};
