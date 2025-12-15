import { PageContainer } from '@/components/containers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomLink } from '@/components/ui/custom-link';
import { ROUTES } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import { ArrowRightIcon } from 'lucide-react';
import { useMemo } from 'react';

const SettingContainer = () => {
  const { t } = useTranslation('settings-page');

  const cards = useMemo(() => {
    return [
      {
        title: t('setting.profile.title'),
        description: t('setting.profile.description'),
        href: ROUTES.PROFILE,
      },
      {
        title: t('setting.system.title'),
        description: t('setting.system.description'),
        href: ROUTES.SYSTEM,
      },
    ];
  }, [t]);

  return (
    <PageContainer pageTitle={t('setting.title')} pageDescription={t('setting.description')}>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {cards.map((card) => (
          <Card key={card.href}>
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size='sm'>
                <CustomLink to={card.href}>
                  {t('buttons.view-details', { ns: 'common' })} <ArrowRightIcon className='size-4' />
                </CustomLink>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
};

export default SettingContainer;
