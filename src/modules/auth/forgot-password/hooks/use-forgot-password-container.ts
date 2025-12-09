import { useTranslation } from '@/integrations/i18n';
import { useForm } from 'react-hook-form';
import { forgotPasswordFormSchema, initialFormData, type ForgotPasswordFormData } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

export const useForgotPasswordContainer = () => {
  const { t } = useTranslation('forgot-password-page');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [expirationTime, setExpirationTime] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordFormSchema(t)),
    defaultValues: initialFormData,
    mode: 'onChange',
  });

  const onSubmitStep1 = (requestForgotPasswordAt?: string) => {
    setStep(2);
    setExpirationTime(requestForgotPasswordAt ?? null);
  };

  const onSubmitStep2 = (requestForgotPasswordAt?: string) => {
    setExpirationTime(requestForgotPasswordAt ?? null);
  };

  const onSubmit = async () => {};

  return {
    t,
    form,
    step,
    expirationTime,
    onSubmitStep1,
    onSubmitStep2,
    onSubmit,
  };
};