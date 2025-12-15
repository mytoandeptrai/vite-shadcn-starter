import { useTranslation } from "@/integrations/i18n";
import { useCallback, useMemo, useState } from "react";
import { generateTokenOptions } from "./config";
import { useAuthContext } from "@/integrations/auth/auth-provider";
import { toast } from "sonner";

export const useBalanceContainer = () => {
  const { t } = useTranslation("balance-page");

  const { user } = useAuthContext();
  const isEnabledTwoFa = user?.twoFAEnabled ?? false;

  const tokenOptions = useMemo(() => generateTokenOptions(t), [t]);
  const [selectedToken, setSelectedToken] = useState(tokenOptions[0].value);

  /** TODO: Request API here */
  const balance = 1000;
  const incomingBalance = 250;

  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const onCloseDialog = useCallback(() => {
    setIsOpenDialog(false);
  }, []);

  const onOpenDialog = useCallback(() => {
    if (!isEnabledTwoFa) {
      toast.error(
        <div>{t("messages.require-two-fa-to-access", { ns: "common" })}</div>
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
