import { Card, CardContent } from '@/components/ui/card';
import ResetPasswordHeaderUi from '../../components/reset-password-header-ui';
import { FormWrapper } from '@/components/ui/form';
import { useResetPasswordContainer } from '../../hooks';
import ResetPasswordFormUi from '../../components/reset-password-form-ui';
import { Show } from '@/components/utilities';
import ResetPasswordSuccessUi from '../../components/reset-password-success-ui';

type ResetPasswordContainerProps = {
  email?: string;
  code?: number;
};

const ResetPasswordContainer = (props: ResetPasswordContainerProps) => {
  const { form, done, onSubmit, onClick, isLoading } = useResetPasswordContainer(props);
  return (
    <Card className='w-full max-w-md gap-6'>
      <ResetPasswordHeaderUi done={done} />
      <CardContent>
        <FormWrapper form={form} onSubmit={onSubmit}>
          <Show when={done}>
            <ResetPasswordSuccessUi onClick={onClick} />
          </Show>
          <Show when={!done}>
            <ResetPasswordFormUi isLoading={isLoading} />
          </Show>
        </FormWrapper>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordContainer;
