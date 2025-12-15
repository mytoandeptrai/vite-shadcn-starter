import { Accordion } from "@/components/ui/accordion";
import { useTranslation } from "@/integrations/i18n";
import { useMemo, useState } from "react";
import DashboardStartInfoUi from "../../components/dashboard-start-info-ui";
import { useNavigate } from "@tanstack/react-router";
import { ROUTES, PAGE_SIZE_OPTIONS } from "@/constant";
import { useAuthContext } from "@/integrations/auth/auth-provider";
import { toast } from "sonner";

const DashboardStartContainer = () => {
  const { user } = useAuthContext();
  const [completed] = useState({ wallet: false, apiKeys: false, sdk: false });
  const [activeItem, setActiveItem] = useState("wallet");
  const { t } = useTranslation("dashboard-page");
  const navigate = useNavigate();

  const isEnabledTwoFa = user?.twoFAEnabled ?? false;

  const listMemo = useMemo(() => {
    return [
      {
        value: "wallet",
        label: t("start-guide.labels.add-wallet-address"),
        description: t("start-guide.descriptions.add-wallet-address"),
        subLabel: t("start-guide.sub-labels.connect-wallet"),
        completed: completed.wallet,
        onClick: () => {
          if (!isEnabledTwoFa) {
            toast.error(
              t("messages.require-two-fa-to-access", { ns: "common" })
            );
            return navigate({
              to: ROUTES.SYSTEM,
            });
          }

          return navigate({
            to: ROUTES.WALLET_ADDRESS,
            search: {
              page: 1,
              pageSize: PAGE_SIZE_OPTIONS[0],
              sortBy: "createdAt",
              sortOrder: "desc",
              forceAddWallet: true,
              search: "",
            },
          });
        },
      },
      {
        value: "apiKeys",
        label: t("start-guide.labels.generate-apiKeys"),
        description: t("start-guide.descriptions.generate-apiKeys"),
        subLabel: t("start-guide.sub-labels.create-api-keys"),
        completed: completed.apiKeys,
        onClick: () => {
          const route = isEnabledTwoFa ? ROUTES.DEVELOPER : ROUTES.SYSTEM;
          if (!isEnabledTwoFa) {
            toast.error(
              t("messages.require-two-fa-to-access", { ns: "common" })
            );
          }
          return navigate({
            to: route,
          });
        },
      },
      {
        value: "sdk",
        label: t("start-guide.labels.download-sdk"),
        description: t("start-guide.descriptions.download-sdk"),
        subLabel: t("start-guide.sub-labels.download-sdk"),
        completed: completed.sdk,
        onClick: () => {
          if (!isEnabledTwoFa) {
            toast.error(
              t("messages.require-two-fa-to-access", { ns: "common" })
            );
          }
          const route = isEnabledTwoFa ? ROUTES.DEVELOPER : ROUTES.SYSTEM;
          return navigate({
            to: route,
          });
        },
      },
    ];
  }, [t, completed.apiKeys, completed.sdk, completed.wallet, isEnabledTwoFa]);

  return (
    <div className="rounded-md border border-border bg-card p-6">
      <h2 className="mb-2 font-semibold text-foreground text-xl">
        {t("start-guide.title")}
      </h2>
      <p className="mb-6 text-muted-foreground text-sm">
        {t("start-guide.description")}
      </p>
      <Accordion
        type="single"
        value={activeItem}
        onValueChange={setActiveItem}
        collapsible
      >
        {listMemo.map((item) => (
          <DashboardStartInfoUi key={item.value} item={item} />
        ))}
      </Accordion>
    </div>
  );
};

export default DashboardStartContainer;
