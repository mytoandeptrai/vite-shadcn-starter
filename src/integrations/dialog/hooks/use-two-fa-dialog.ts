import { useVerifyTwoFaSession } from '@/apis/auth';
import { useTranslation } from '@/integrations/i18n';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { TwoFaDialogProps } from '../components/two-fa-dialog';
import { initialFormData, twoFaFormSchema, type TwoFaFormData } from './schema';

export const useTwoFaDialog = ({ skipInitVerification, closeOnSubmit, onSubmit, onClose }: TwoFaDialogProps) => {
  const { t } = useTranslation();
  const verifySessionMutation = useVerifyTwoFaSession();
  const isLoading = verifySessionMutation.isPending;

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
      const res = await verifySessionMutation.mutateAsync({ code });
      isVerified = !!res.data;
      _code = code;
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
    isLoading,
    submit,
  };
};
