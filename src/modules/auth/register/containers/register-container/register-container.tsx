import { FormWrapper } from '@/components/ui/form';
import { useRegisterContainer } from '../../hooks';
import { Card, CardContent } from '@/components/ui/card';
import { RegisterFormUi, RegisterHeaderUi } from '../../components';

const RegisterContainer = () => {
  const { form, onSubmit, isLoading } = useRegisterContainer();
  return (
    <Card className='w-full max-w-md gap-10'>
      <RegisterHeaderUi />
      <CardContent>
        <FormWrapper form={form} onSubmit={onSubmit}>
          <RegisterFormUi isLoading={isLoading} />
        </FormWrapper>
      </CardContent>
    </Card>
  );
};

export default RegisterContainer;
