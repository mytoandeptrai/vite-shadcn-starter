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

export const useProfilePasswordContainer = () => {
  const { t } = useTranslation("settings-page");
  const [isUpdated, setIsUpdated] = useState<boolean>(false);

  const isLoading = false;

  const { user } = useAuthContext();
  const isEnabledTwoFa = user?.twoFAEnabled ?? false;

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
    console.log("🚀 ~ onSubmit ~ data:", data);
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
