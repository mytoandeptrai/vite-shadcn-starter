import { useSetupTwoFa, useVerifySetup } from '@/apis/auth';
import { useAuthContext } from '@/integrations/auth/auth-provider';
import { useDialogContext } from '@/integrations/dialog/dialog-provider';
import { useTranslation } from '@/integrations/i18n';
import { useState } from 'react';

const steps = [
  { label: 'system.labels.two-fa.steps.1', value: 1 },
  { label: 'system.labels.two-fa.steps.2', value: 2 },
  { label: 'system.labels.two-fa.steps.3', value: 3 },
  { label: 'system.labels.two-fa.steps.4', value: 4 },
];

export const useSystemTwoFaStepsContainer = () => {
  const { t } = useTranslation('settings-page');
  const [currentStep, setCurrentStep] = useState(1);

  const { user, isAuthenticated } = useAuthContext();
  const { onOpenTwoFAModal, onCloseModal } = useDialogContext();
  const isEnabledTwoFa = user?.twoFAEnabled ?? false;

  const { data, isLoading, error } = useSetupTwoFa({
    enabled: isAuthenticated && !isEnabledTwoFa,
  });

  const verifySetupMutation = useVerifySetup();

  const authenticatorCode = data?.data?.base32 ?? '';
  const otpUrl = data?.data?.otpauth_url ?? '';

  const onSubmitStep4 = () => {
    /** Todo: Implement API here */
    onOpenTwoFAModal({
      forceOpen: true,
      skipInitVerification: true,
      closeOnSubmit: false,
      cb: async (code) => {
        const res = await verifySetupMutation.mutateAsync({ code: code! });
        if (res.data) {
          onCloseModal();
          setCurrentStep((prev) => prev + 1);
        }
      },
    });
  };

  const onClickNext = () => {
    if (currentStep === steps.length - 1) {
      onSubmitStep4();
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  return {
    t,
    isLoading,
    currentStep,
    steps,
    authenticatorCode,
    otpUrl,
    error,
    onClickNext,
    setCurrentStep,
  };
};
