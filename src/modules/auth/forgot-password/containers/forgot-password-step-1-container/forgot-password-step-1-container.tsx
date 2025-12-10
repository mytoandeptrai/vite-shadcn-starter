import { Card, CardContent } from '@/components/ui/card';
import { ForgotPasswordHeaderUi, ForgotPasswordStep_1FormUi } from '../../components';
import { useForgotPasswordStep_1Container } from '../../hooks';

type ForgotPasswordStep_1ContainerProps = {
  onSubmit: (requestForgotPasswordAt?: string) => void;
};

const ForgotPasswordStep_1Container = ({ onSubmit }: ForgotPasswordStep_1ContainerProps) => {
  const { t, isLoading, clickContinue } = useForgotPasswordStep_1Container({ onSubmit });
  return (
    <Card className='w-full gap-10'>
      <ForgotPasswordHeaderUi title={t('title')} description={t('description')} />
      <CardContent>
        <ForgotPasswordStep_1FormUi isLoading={isLoading} onClick={clickContinue} />
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordStep_1Container;
