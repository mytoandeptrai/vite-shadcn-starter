import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CopyButton from '@/components/ui/copy-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/integrations/i18n';
import { Edit } from 'lucide-react';

type DeveloperApiUrlsInputUiProps = {
  onOpenDialog: () => void;
  isLoading: boolean;
  notifyUrl: string;
  returnUrl: string;
};

const DeveloperApiUrlsInputUi = ({ isLoading, notifyUrl, returnUrl, onOpenDialog }: DeveloperApiUrlsInputUiProps) => {
  const { t } = useTranslation('developer-page');
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='text-lg'>{t('api-urls.labels.title')}</CardTitle>
            <CardDescription>
              {t('labels.created-at')}: {new Date().toLocaleDateString()}
            </CardDescription>
          </div>
          <Button variant='outline' size='sm' onClick={onOpenDialog} disabled={isLoading}>
            <Edit className='mr-2 h-4 w-4' />
            {t('api-urls.actions.update-urls')}
          </Button>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-4'>
          <Label>{t('api-urls.labels.notify-url')}</Label>
          <div className='flex items-center gap-2'>
            <Input containerClassName='flex-1' value={notifyUrl} readOnly className='font-mono text-sm' />
            <CopyButton value={notifyUrl} />
          </div>
        </div>
        <div className='space-y-4'>
          <Label>{t('api-urls.labels.return-url')}</Label>
          <div className='flex items-center gap-2'>
            <Input containerClassName='flex-1' value={returnUrl} readOnly className='font-mono text-sm' />
            <CopyButton value={returnUrl} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeveloperApiUrlsInputUi;
