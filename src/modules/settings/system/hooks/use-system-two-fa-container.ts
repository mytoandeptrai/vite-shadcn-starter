import { KEYS, useDisableTwoFa } from "@/apis/auth";
import { useAuthContext } from "@/integrations/auth/auth-provider";
import { useTranslation } from "@/integrations/i18n";
import { getContext } from "@/integrations/tanstack-query/root-provider";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const useSystemTwoFaContainer = () => {
  const { t } = useTranslation("settings-page");
  const { user, onRefetch } = useAuthContext();
  const { queryClient } = getContext();
  const isEnabledTwoFa = user?.twoFAEnabled ?? false;

  const disableTwoFaMutation = useDisableTwoFa();

  const isLoading = disableTwoFaMutation.isPending;

  const [isOpenSteps, setIsOpenSteps] = useState(false);
  const [isRemovedTwoFa, setIsRemovedTwoFa] = useState(false);

  const onBack = useCallback(() => {
    setIsOpenSteps(false);
  }, []);

  const onOpenSteps = useCallback(() => {
    setIsOpenSteps(true);
  }, []);

  const onResetTwoFa = useCallback(() => {
    setIsRemovedTwoFa(false);
  }, []);

  const onClick = () => {
    if (isEnabledTwoFa) {
      setIsRemovedTwoFa(true);
      return;
    }
    setIsOpenSteps(true);
  };

  const onSubmitRemoveTwoFa = useCallback(
    async (password: string) => {
      await disableTwoFaMutation.mutateAsync({ password });
      await queryClient.invalidateQueries({ queryKey: [KEYS.INFO] });
      onRefetch();
      toast.success(t("messages.two-fa-disabled-success", { ns: "common" }));
      setIsRemovedTwoFa(false);
    },
    [disableTwoFaMutation]
  );

  return {
    t,
    isEnabledTwoFa,
    isOpenSteps,
    isRemovedTwoFa,
    isLoading,
    onBack,
    onOpenSteps,
    onResetTwoFa,
    onClick,
    onSubmitRemoveTwoFa,
  };
};
