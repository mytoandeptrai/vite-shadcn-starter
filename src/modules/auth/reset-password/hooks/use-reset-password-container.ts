import { useTranslation } from "@/integrations/i18n";
import { useForm } from "react-hook-form";
import {
  initialFormData,
  resetPasswordFormSchema,
  type ResetPasswordFormData,
} from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ROUTES } from "@/constant";
import { useResetPassword } from "@/apis/auth";
import { toast } from "sonner";

type Props = {
  token?: string;
};

export const useResetPasswordContainer = ({ token }: Props) => {
  const { t } = useTranslation("reset-password-page");
  const navigate = useNavigate();
  const [done, setDone] = useState<boolean>(false);

  const resetPasswordMutation = useResetPassword();
  const isLoading = resetPasswordMutation.isPending;

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordFormSchema(t)),
    defaultValues: initialFormData,
    mode: "onChange",
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;
    const payload = {
      token,
      newPassword: data.password,
      confirmPassword: data.confirmPassword,
    };
    try {
      await resetPasswordMutation.mutateAsync(payload);
      toast.success(t("messages.reset-password-success", { ns: "common" }));
      setDone(true);
    } catch (error) {
      console.error(error);
    }
  };

  const onClick = () => {
    navigate({
      to: ROUTES.LOGIN,
    });
  };

  return {
    t,
    isLoading,
    form,
    done,
    onSubmit,
    onClick,
  };
};
