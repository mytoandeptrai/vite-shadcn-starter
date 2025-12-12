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
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper';
import { useTranslation } from '@/integrations/i18n';
import { useState } from 'react';
import SystemTwoFaStep1Ui from '../../components/system-two-fa-steps/system-two-fa-step1-ui';
import SystemTwoFaStep2Ui from '../../components/system-two-fa-steps/system-two-fa-step2-ui';
import SystemTwoFaStep3Ui from '../../components/system-two-fa-steps/system-two-fa-step3-ui';
import SystemTwoFaStep4Ui from '../../components/system-two-fa-steps/system-two-fa-step4-ui';
import { cn } from '@/lib/utils';

const steps = [
  { label: 'system.labels.two-fa.steps.1', value: 1 },
  { label: 'system.labels.two-fa.steps.2', value: 2 },
  { label: 'system.labels.two-fa.steps.3', value: 3 },
  { label: 'system.labels.two-fa.steps.4', value: 4 },
];

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

  const onSubmitStep4 = () => {
    /** Todo: Implement API here */
    setCurrentStep((prev) => prev + 1);
  };

  const onClickNext = () => {
    if (currentStep === steps.length) {
      onSubmitStep4();
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  return (
    <>
      <CardContent>
        <div className='mx-auto max-w-2xl'>
          <Stepper value={currentStep} onValueChange={setCurrentStep} className='space-y-8'>
            <StepperNav>
              {steps.map((step, index) => (
                <StepperItem key={index} step={index + 1} className='relative flex-1 items-start'>
                  <StepperTrigger className='flex flex-col gap-2.5'>
                    <StepperIndicator>{index + 1}</StepperIndicator>
                    <StepperTitle
                      className={cn('', {
                        'text-muted-foreground': index + 1 !== currentStep,
                      })}
                    >
                      {t(step.label)}
                    </StepperTitle>
                  </StepperTrigger>
                  {steps.length > index + 1 && (
                    <StepperSeparator className='absolute inset-x-0 top-3 left-[calc(50%+0.875rem)] m-0 group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem+0.225rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none group-data-[state=completed]/step:bg-primary' />
                  )}
                </StepperItem>
              ))}
            </StepperNav>

            <StepperPanel className='text-sm'>
              {steps.map((step) => (
                <StepperContent
                  className='flex w-full items-center justify-center py-6'
                  key={step.value}
                  value={step.value}
                >
                  {step.value === 1 && <SystemTwoFaStep1Ui />}
                  {step.value === 2 && <SystemTwoFaStep2Ui authenticatorCode={authenticatorCode} otpUrl={otpUrl} />}
                  {step.value === 3 && <SystemTwoFaStep3Ui authenticatorCode={authenticatorCode} />}
                  {step.value === 4 && <SystemTwoFaStep4Ui />}
                </StepperContent>
              ))}
            </StepperPanel>
          </Stepper>
        </div>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-center justify-between gap-2.5'>
          <Button variant='outline' onClick={onBack}>
            {t('buttons.cancel', { ns: 'common' })}
          </Button>
          <div className='flex items-center justify-center gap-2.5'>
            <Button variant='outline' onClick={() => setCurrentStep((prev) => prev - 1)} disabled={currentStep === 1}>
              {t('buttons.previous', { ns: 'common' })}
            </Button>
            <Button onClick={onClickNext} disabled={currentStep === steps.length}>
              {t('buttons.next', { ns: 'common' })}
            </Button>
          </div>
        </div>
      </CardFooter>
    </>
  );
};

export default SystemTwoFaStepsContainer;