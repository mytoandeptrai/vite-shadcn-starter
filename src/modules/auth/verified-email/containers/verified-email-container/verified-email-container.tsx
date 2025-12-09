import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/integrations/i18n';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '@/constant';

const VerifiedEmailContainer = () => {
  const { t } = useTranslation('verified-email-page');
  const navigate = useNavigate();
  return (
    <Card className='w-full max-w-md gap-10'>
      <CardHeader className='text-center'>
        <CardTitle className='font-bold text-2xl text-gray-800 text-title-sm sm:text-title-md dark:text-white/90'>
          {t('title')}
        </CardTitle>
        <CardDescription className='text-gray-500 text-sm dark:text-gray-400'>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          size='lg'
          className='w-full'
          onClick={() => {
            navigate({
              to: ROUTES.LOGIN,
            });
          }}
        >
          {t('buttons.go-to-login')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default VerifiedEmailContainer;
