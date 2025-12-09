import { FormWrapper } from '@/components/ui/form';
import { useLoginContainer } from '../../hooks';
import { Card, CardContent } from '@/components/ui/card';
import { LoginFormUi, LoginHeaderUi } from '../../components';

const LoginContainer = () => {
  const { form, onSubmit, isLoading } = useLoginContainer();
  return (
    <Card className='w-full max-w-md gap-10'>
      <LoginHeaderUi />
      <CardContent>
        <FormWrapper form={form} onSubmit={onSubmit}>
          <LoginFormUi isLoading={isLoading} />
        </FormWrapper>
      </CardContent>
    </Card>
  );
};

export default LoginContainer;
