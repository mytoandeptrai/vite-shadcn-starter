import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTrigger,
} from '@/components/ui/stepper';
import { useTranslation } from '@/integrations/i18n';
import { useState } from 'react';
import SystemTwoFaStep1Ui from '../../components/system-two-fa-steps/system-two-fa-step1-ui';
import SystemTwoFaStep2Ui from '../../components/system-two-fa-steps/system-two-fa-step2-ui';
import SystemTwoFaStep3Ui from '../../components/system-two-fa-steps/system-two-fa-step3-ui';
import SystemTwoFaStep4Ui from '../../components/system-two-fa-steps/system-two-fa-step4-ui';

const steps = [1, 2, 3, 4];

interface SystemTwoFaStepsContainerProps {
  onBack: () => void;
}

const data = {
  base32: 'G5HU452QGNKEKNLYMVJEIMDXIYUXQLC3MJ5EMSJPKBTFQ625EVUQ',
  otpauth_url: 'otpauth://totp/PQUSD:toantpm@var-meta.com?secret=G5HU452QGNKEKNLYMVJEIMDXIYUXQLC3MJ5EMSJPKBTFQ625EVUQ',
};

const SystemTwoFaStepsContainer = ({ onBack }: SystemTwoFaStepsContainerProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { t } = useTranslation('settings-page');

  const authenticatorCode = data?.base32;
  const otpUrl = data?.otpauth_url;

  return (
    <>
      <CardContent>
        <Stepper value={currentStep} onValueChange={setCurrentStep} className='space-y-8'>
          <StepperNav>
            {steps.map((step) => (
              <StepperItem key={step} step={step}>
                <StepperTrigger>
                  <StepperIndicator className='size-12'>
                    <div className='text-base'>{step}</div>
                  </StepperIndicator>
                </StepperTrigger>
                {steps.length > step && <StepperSeparator className='group-data-[state=completed]/step:bg-primary' />}
              </StepperItem>
            ))}
          </StepperNav>

          <StepperPanel className='text-sm'>
            {steps.map((step) => (
              <StepperContent className='flex w-full items-center justify-center py-10' key={step} value={step}>
                {step === 1 && <SystemTwoFaStep1Ui />}
                {step === 2 && <SystemTwoFaStep2Ui authenticatorCode={authenticatorCode} otpUrl={otpUrl} />}
                {step === 3 && <SystemTwoFaStep3Ui authenticatorCode={authenticatorCode} />}
                {step === 4 && <SystemTwoFaStep4Ui />}
              </StepperContent>
            ))}
          </StepperPanel>
        </Stepper>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-center justify-between gap-2.5'>
          <Button variant='outline' onClick={onBack}>
            Cancel
          </Button>

          <div className='flex items-center justify-center gap-2.5'>
            <Button variant='outline' onClick={() => setCurrentStep((prev) => prev - 1)} disabled={currentStep === 1}>
              Previous
            </Button>
            <Button onClick={() => setCurrentStep((prev) => prev + 1)} disabled={currentStep === steps.length}>
              Next
            </Button>
          </div>
        </div>
      </CardFooter>
    </>
  );
};

export default SystemTwoFaStepsContainer;