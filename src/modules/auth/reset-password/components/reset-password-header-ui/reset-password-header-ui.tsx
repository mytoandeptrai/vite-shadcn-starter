import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Show } from '@/components/utilities';
import { useTranslation } from '@/integrations/i18n';

type Props = {
  done: boolean;
};

const ResetPasswordHeaderUi = ({ done }: Props) => {
  const { t } = useTranslation('reset-password-page');

  return (
    <CardHeader className='text-center'>
      <CardTitle className='font-bold text-2xl text-gray-800 text-title-sm sm:text-title-md dark:text-white/90'>
        {t('title')}
      </CardTitle>
      <Show when={!done}>
        <CardDescription className='text-gray-500 text-sm dark:text-gray-400'>{t('description')}</CardDescription>
      </Show>
    </CardHeader>
  );
};

export default ResetPasswordHeaderUi;
