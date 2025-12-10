import { zodResolver } from '@hookform/resolvers/zod';
import { initialFormData, twoFaFormSchema, type TwoFaFormData } from './schema';
import { useTranslation } from '@/integrations/i18n';
import { useForm } from 'react-hook-form';
import type { TwoFaDialogProps } from '../components/two-fa-dialog';
import { useState } from 'react';

export const useTwoFaDialog = ({ skipInitVerification, closeOnSubmit, onSubmit, onClose }: TwoFaDialogProps) => {
  const { t } = useTranslation();
  const [isGenerating2FaOtpCode, setIsGenerating2FaOtpCode] = useState(false);

  const isLoading = false;

  const form = useForm<TwoFaFormData>({
    resolver: zodResolver(twoFaFormSchema(t)),
    defaultValues: initialFormData,
    mode: 'onChange',
  });

  const submit = async (data: TwoFaFormData) => {
    const code = data?.code;
    let isVerified = false;
    let _code = null;
    if (!skipInitVerification) {
      if (!code) return;
      /** TODO: Implement API here */
      const res = { data: {} };
      isVerified = !!res.data;

      setIsGenerating2FaOtpCode(true);
      /** TODO: Implement API here */
      const _res = { data: { code: '123456' } };
      setIsGenerating2FaOtpCode(false);
      _code = _res.data?.code ?? null;
    } else {
      isVerified = true;
      _code = code;
    }

    if (!isVerified || !_code) return;

    onSubmit?.(_code);

    if (closeOnSubmit) {
      onClose?.();
    }
  };

  return {
    t,
    form,
    isGenerating2FaOtpCode,
    isLoading,
    submit,
  };
};