import LanguageSwitcher from '@/components/shared/language-switcher';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/integrations/i18n';

const SystemLanguageUi = () => {
  const { t } = useTranslation('settings-page');
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <div>
          <CardTitle className='text-base'>{t('system.labels.languages.title')}</CardTitle>
          <CardDescription>{t('system.labels.languages.description')}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <LanguageSwitcher />
      </CardContent>
    </Card>
  );
};

export default SystemLanguageUi;
