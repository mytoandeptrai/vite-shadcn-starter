import { Card, CardContent } from '@/components/ui/card';
import { useForgotPasswordStep_2Container } from '../../hooks';
import { ForgotPasswordHeaderUi } from '../../components';
import { Button } from '@/components/ui/button';
import { Show } from '@/components/utilities';
import { Spinner } from '@/components/ui/spinner';
import { Paragraph } from '@/components/ui/typography';

type ForgotPasswordStep_2ContainerProps = {
  expirationTime: string | null;
  onSubmit: (requestForgotPasswordAt?: string) => void;
};

const ForgotPasswordStep_2Container = ({ expirationTime, onSubmit }: ForgotPasswordStep_2ContainerProps) => {
  const { t, isLoading, minutes, seconds, isCounting, _isCounting, submit } = useForgotPasswordStep_2Container({
    onSubmit,
    expirationTime
  });
  return (
    <Card className='w-full gap-10'>
      <ForgotPasswordHeaderUi title={t('resend.title')} description={t('resend.description')} />
      <CardContent>
        <Button type="button" disabled={isLoading || _isCounting} size='lg' className='w-full' onClick={submit}>
          <Show when={isLoading}>
            <Spinner />
          </Show>
          {t('resend.buttons.resend')}
        </Button>
        <Show when={isCounting}>
          <Paragraph className='mt-5 text-center'>{`${minutes}:${seconds}`}</Paragraph>
        </Show>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordStep_2Container;
