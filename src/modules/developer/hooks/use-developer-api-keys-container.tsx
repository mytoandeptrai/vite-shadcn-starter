import { ROUTES } from "@/constant";
import { useAuthContext } from "@/integrations/auth/auth-provider";
import { useTranslation } from "@/integrations/i18n";
import { Link } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const useDeveloperApiKeysContainer = () => {
  const { t } = useTranslation("developer-page");
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const { user } = useAuthContext();
  const isEnabledTwoFa = user?.twoFAEnabled ?? false;

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
    setIsOpenDialog(true);
  }, []);

  /** TODO: Request API here */
  const isLoading = false;
  const publicKey = "pk_live_z09e9alqg2i";
  const secretKey = "sk_live_6kmxy1hhd66";

  return {
    t,
    isLoading,
    publicKey,
    secretKey,
    isOpenDialog,
    onCloseDialog,
    onOpenDialog,
  };
};
