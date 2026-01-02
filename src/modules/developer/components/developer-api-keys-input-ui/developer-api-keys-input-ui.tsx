import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CopyButton from '@/components/ui/copy-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/integrations/i18n';
import { formatDate } from '@/utils';
import { RefreshCw, TriangleAlertIcon } from 'lucide-react';

type DeveloperApiKeysInputUiProps = {
  onOpenDialog: () => void;
  isLoading: boolean;
  publicKey: string;
  secretKey: string;
  createdAt: string;
};

const DeveloperApiKeysInputUi = ({
  isLoading,
  publicKey,
  secretKey,
  createdAt,
  onOpenDialog,
}: DeveloperApiKeysInputUiProps) => {
  const { t } = useTranslation('developer-page');
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='text-lg'>{t('api-keys.labels.title')}</CardTitle>
            <CardDescription>
              {t('labels.created-at')}: {createdAt ? formatDate(createdAt) : '-'}
            </CardDescription>
          </div>
          <Button variant='outline' size='sm' onClick={onOpenDialog} disabled={isLoading}>
            <RefreshCw className='mr-2 h-4 w-4' />
            {t('api-keys.actions.generate-new-key')}
          </Button>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-4'>
          <Label>{t('api-keys.labels.public-key')}</Label>
          <div className='flex items-center gap-2'>
            <Input containerClassName='flex-1' value={publicKey} readOnly className='font-mono text-sm' />
            <CopyButton value={publicKey} />
          </div>
        </div>
        <div className='space-y-4'>
          <Label>{t('api-keys.labels.secret-key')}</Label>
          <div className='flex items-center gap-2'>
            <Input
              containerClassName='flex-1'
              type='password'
              value={secretKey}
              readOnly
              className='font-mono text-sm'
            />
            <CopyButton value={secretKey} />
          </div>
          <div className='flex items-center gap-2'>
            <TriangleAlertIcon size={16} className='text-warning' />
            <p className='font-semibold text-xs'>{t('api-keys.labels.secret-key-description')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeveloperApiKeysInputUi;
