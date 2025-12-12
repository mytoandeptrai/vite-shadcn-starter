import { useLoginMutation } from "@/apis/auth";
import {
  sanitizeRedirect,
  usePreviousLocation,
} from "@/hooks/use-previous-location";
import { useTranslation } from "@/integrations/i18n";
import { useSessionStore } from "@/stores/use-session-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { initialFormData, loginFormSchema, type LoginFormData } from "./schema";
import { useAuthContext } from "@/integrations/auth/auth-provider";
import { toast } from "sonner";

export const useLoginContainer = () => {
  const { t } = useTranslation("login-page");
  const { setAccessToken, setRefreshToken } = useSessionStore();
  const navigate = useNavigate();
  const previousLocation = usePreviousLocation();
  const { onRefetch } = useAuthContext();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema(t)),
    defaultValues: initialFormData,
    mode: "onChange",
  });

  const useLogin = useLoginMutation();
  const isLoading = useLogin.isPending;

  const onSubmit = async (payload: LoginFormData) => {
    if (isLoading) return;
    try {
      const { data } = await useLogin.mutateAsync(payload);
      toast.success(t("messages.login-success", { ns: "common" }));
      if (data) {
        setAccessToken(data?.accessToken!);
        setRefreshToken(data?.refreshToken!);
        await onRefetch();
      }
      const target = sanitizeRedirect(previousLocation);
      navigate({ to: target });
    } catch (error) {
      console.error(error);
    }
  };

  return {
    t,
    isLoading,
    form,
    onSubmit,
  };
};
