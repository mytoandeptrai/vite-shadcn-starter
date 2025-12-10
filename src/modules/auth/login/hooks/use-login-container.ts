import { useTranslation } from '@/integrations/i18n';
import { useForm } from 'react-hook-form';
import { initialFormData, loginFormSchema, type LoginFormData } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { sanitizeRedirect, usePreviousLocation } from '@/hooks/use-previous-location';
import { useNavigate } from '@tanstack/react-router';

export const useLoginContainer = () => {
  const { t } = useTranslation('login-page');
  const navigate = useNavigate();
  const previousLocation = usePreviousLocation();
  const isLoading = false;
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema(t)),
    defaultValues: initialFormData,
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log(data);
    /** TODO: Implement API here */
    const target = sanitizeRedirect(previousLocation);
    if (target) navigate({ to: target });
  };

  return {
    t,
    isLoading,
    form,
    onSubmit,
  };
};