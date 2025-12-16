import { useTranslation } from "@/integrations/i18n";
import { useCallback, useMemo, useState } from "react";
import { generateTokenOptions } from "./config";
import { useAuthContext } from "@/integrations/auth/auth-provider";
import { toast } from "sonner";
import { PAGE_SIZE_OPTIONS, ROUTES } from "@/constant";
import { Link } from "@tanstack/react-router";

export const useBalanceContainer = () => {
  const { t } = useTranslation("balance-page");

  const { user } = useAuthContext();
  const isEnabledTwoFa = user?.twoFAEnabled ?? false;

  const tokenOptions = useMemo(() => generateTokenOptions(t), [t]);
  const [selectedToken, setSelectedToken] = useState(tokenOptions[0].value);

  /** TODO: Request API here */
  const balance = 1000;
  const incomingBalance = 250;
  const hasWallets = false;

  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const onCloseDialog = useCallback(() => {
    setIsOpenDialog(false);
  }, []);

  const onOpenDialog = useCallback(() => {
    if (!isEnabledTwoFa) {
      toast.error(
        <Link to={ROUTES.SYSTEM} className="hover:underline">
          {t("messages.require-enable-two-fa", { ns: "common" })}
        </Link>
      );
      return;
    }

    if (!hasWallets) {
      toast.error(
        <Link
          to={ROUTES.WALLET_ADDRESS}
          search={{
            page: 1,
            pageSize: PAGE_SIZE_OPTIONS[0],
            sortBy: "createdAt",
            sortOrder: "desc",
            search: "",
            forceAddWallet: true,
            chain: []
          }}
          className="hover:underline"
        >
          {t("messages.require-add-wallet", { ns: "common" })}
        </Link>
      );
      return;
    }

    setIsOpenDialog(true);
  }, []);

  const onSelectToken = useCallback((value: string) => {
    setSelectedToken(value);
  }, []);

  return {
    t,
    tokenOptions,
    selectedToken,
    balance,
    incomingBalance,
    isOpenDialog,
    onCloseDialog,
    onOpenDialog,
    onSelectToken,
  };
};
