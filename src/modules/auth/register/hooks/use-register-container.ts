import { useRegister } from '@/apis/auth';
import { keyLocalStorage, ROUTES } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import { Route } from '@/routes/(auth)/register';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { initialFormData, registerFormSchema, type RegisterFormData } from './schema';
import { setLocalStorageItem } from '@/utils';

export const useRegisterContainer = () => {
  const { t } = useTranslation('register-page');
  const navigate = useNavigate({ from: Route.fullPath });

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema(t)),
    defaultValues: initialFormData,
    mode: 'onChange',
  });

  const registerMutation = useRegister();
  const isLoading = registerMutation.isPending;

  const onSubmit = async (data: RegisterFormData) => {
    /** TODO: Add first name and last name */
    try {
      const payload = {
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        firstname: data.firstName,
        lastname: data.lastName,
        userType: data.type,
      };
      await registerMutation.mutateAsync(payload);
      const timeStamp = Date.now();
      setLocalStorageItem(keyLocalStorage.EXPIRED_SIGN_UP_TIME, `${timeStamp + 300000}`);
      toast.success(t('messages.register-success', { ns: 'common' }));
      navigate({
        to: ROUTES.VERIFY_EMAIL,
        search: { email: data.email },
      });
    } catch (error) {
      console.error('🚀', error);
      // if (error.code === 400 && error.message === messageError.EMAIL_EXISTED) {
      //   setError("email", {
      //     type: "manual",
      //     message: t("errors.code.EMAIL_EXISTED"),
      //   });
      // }
    }
  };

  return {
    t,
    isLoading,
    form,
    onSubmit,
  };
};
