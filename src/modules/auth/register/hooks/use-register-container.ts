import { useTranslation } from '@/integrations/i18n';
import { useForm } from 'react-hook-form';
import { initialFormData, registerFormSchema, type RegisterFormData } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '@/constant';
import { Route } from '@/routes/(auth)/register';

export const useRegisterContainer = () => {
  const { t } = useTranslation('register-page');
  const navigate = useNavigate({ from: Route.fullPath });
  const isLoading = false;

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema(t)),
    defaultValues: initialFormData,
    mode: 'onChange',
  });

  const onSubmit = async (data: RegisterFormData) => {
    /** Todo: Call API */
    navigate({
      to: ROUTES.VERIFY_EMAIL,
      search: { email: data.email },
    });
  };

  return {
    t,
    isLoading,
    form,
    onSubmit,
  };
};