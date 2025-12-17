import { useTranslation } from "@/integrations/i18n";
import { passwordFormSchema, type PasswordFormSchema } from "./password.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { initialPasswordFormData } from "./password.schema";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { ROUTES } from "@/constant";
import { useAuthContext } from "@/integrations/auth/auth-provider";
import { useDialogContext } from "@/integrations/dialog/dialog-provider";
import { useUpdatePassword } from "@/apis/auth";

export const useProfilePasswordContainer = () => {
  const { t } = useTranslation("settings-page");
  const [isUpdated, setIsUpdated] = useState<boolean>(false);

  const { user, onSignout } = useAuthContext();
  const { onOpenTwoFAModal, onCloseModal } = useDialogContext();

  const updatePasswordMutation = useUpdatePassword();

  const isEnabledTwoFa = user?.twoFAEnabled ?? false;
  const isLoading = updatePasswordMutation.isPending;

  const form = useForm<PasswordFormSchema>({
    resolver: zodResolver(passwordFormSchema(t)),
    defaultValues: initialPasswordFormData,
    mode: "onChange",
  });

  const onSubmit = async (data: PasswordFormSchema) => {
    if (!isEnabledTwoFa) {
      toast.error(
        <Link to={ROUTES.SYSTEM} className="hover:underline">
          {t("messages.require-enable-two-fa", { ns: "common" })}
        </Link>
      );
      return;
    }

    onOpenTwoFAModal({
      forceOpen: true,
      skipInitVerification: true,
      closeOnSubmit: false,
      cb: async (code) => {
        await updatePasswordMutation.mutateAsync({
          confirmPassword: data.confirmNewPassword,
          twoFACode: code!,
        });
        toast.success(t("messages.update-password-success", { ns: "common" }));
        setIsUpdated(false);
        form.reset(initialPasswordFormData);
        onCloseModal();
        await onSignout();
      },
    });
  };

  const onCancel = () => {
    setIsUpdated(false);
    form.reset(initialPasswordFormData);
  };

  return {
    t,
    form,
    isUpdated,
    isLoading,
    setIsUpdated,
    onSubmit,
    onCancel,
  };
};
