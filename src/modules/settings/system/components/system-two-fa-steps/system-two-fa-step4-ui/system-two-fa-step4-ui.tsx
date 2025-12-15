import CircledCheckIcon2 from "@/assets/icons/circled-check-icon2.svg?react";
import { Paragraph } from "@/components/ui/typography";
import { useAuthContext } from "@/integrations/auth/auth-provider";
import { useTranslation } from "@/integrations/i18n";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

const SystemTwoFaStep4Ui = () => {
  const { t } = useTranslation("settings-page");
  const { onSignout } = useAuthContext();

  const onSignOut = useCallback(async () => {
    await onSignout();
  }, [onSignout]);

  useEffect(() => {
    (async () => {
      toast.success(t("messages.two-fa-setup-success", { ns: "common" }));
      setTimeout(() => {
        onSignOut();
      }, 3000);
    })();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <CircledCheckIcon2 width={56} height={56} />
      <Paragraph className="text-center text-sm">
        {t("system.labels.two-fa.labels.step4-message")}
      </Paragraph>
    </div>
  );
};

export default SystemTwoFaStep4Ui;
