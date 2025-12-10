import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/integrations/i18n';

const LoginHeaderUi = () => {
  const {t} = useTranslation('login-page');
  return (
    <CardHeader className='text-center'>
      <CardTitle className='font-bold text-2xl text-gray-800 text-title-sm sm:text-title-md dark:text-white/90'>
        {t('title')}
      </CardTitle>
      <CardDescription className='text-gray-500 text-sm dark:text-gray-400'>
        {t('description')}
      </CardDescription>
    </CardHeader>
  );
};

export default LoginHeaderUi;
