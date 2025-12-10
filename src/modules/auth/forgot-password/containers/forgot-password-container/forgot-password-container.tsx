import { FormWrapper } from '@/components/ui/form';
import { Show } from '@/components/utilities';
import { useForgotPasswordContainer } from '../../hooks';
import ForgotPasswordStep_1Container from '../forgot-password-step-1-container';
import ForgotPasswordStep_2Container from '../forgot-password-step-2-container';

const ForgotPasswordContainer = () => {
  const { form, step, expirationTime, onSubmitStep1, onSubmitStep2, onSubmit } = useForgotPasswordContainer();
  return (
    <FormWrapper form={form} onSubmit={onSubmit} className='w-full max-w-md'>
      <Show when={step === 1}>
        <ForgotPasswordStep_1Container onSubmit={onSubmitStep1} />
      </Show>
      <Show when={step === 2}>
        <ForgotPasswordStep_2Container expirationTime={expirationTime} onSubmit={onSubmitStep2} />
      </Show>
    </FormWrapper>
  );
};

export default ForgotPasswordContainer;
