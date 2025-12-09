import { useTranslation } from '@/integrations/i18n';
import { useForm } from 'react-hook-form';
import { initialFormData, resetPasswordFormSchema, type ResetPasswordFormData } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '@/constant';

type Props = {
  email?: string;
  code?: number;
};

export const useResetPasswordContainer = ({ code, email }: Props) => {
  const { t } = useTranslation('reset-password-page');
  const navigate = useNavigate();
  const [done, setDone] = useState<boolean>(false);

  const isLoading = false;

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordFormSchema(t)),
    defaultValues: initialFormData,
    mode: 'onChange',
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    /** Todo: Call API */
    console.log('🚀 ~ onSubmit ~ data:', { email, code, ...data });
    setDone(true);
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