import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/integrations/i18n';
import { downloadFile } from '@/utils';
import { Download, ExternalLink, FileText, Github } from 'lucide-react';
import type { ISDK } from '../../types/sdk.types';

type SDKDetailModalUiProps = {
  sdk: ISDK | null;
  isOpen: boolean;
  onClose: () => void;
};

const SDKDetailModalUi = ({ sdk, isOpen, onClose }: SDKDetailModalUiProps) => {
  const { t } = useTranslation('developer-page');

  if (!sdk) return null;

  const handleDownload = () => {
    downloadFile(sdk.downloadUrl, sdk.name);
  };

  const handleDocumentation = () => {
    window.open(sdk.documentationUrl, '_blank');
  };

  const handleGithub = () => {
    window.open(sdk.githubUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl'>{sdk.name}</DialogTitle>
          <DialogDescription className='text-base'>{sdk.description}</DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          {/* SDK Info */}
          <div className='space-y-4'>
            {sdk.version && (
              <div>
                <p className='mb-1 font-medium text-muted-foreground text-sm'>{t('sdks.modal.version')}</p>
                <p className='text-base'>{sdk.version}</p>
              </div>
            )}

            {sdk.language && (
              <div>
                <p className='mb-1 font-medium text-muted-foreground text-sm'>{t('sdks.modal.language')}</p>
                <p className='text-base'>{sdk.language}</p>
              </div>
            )}

            {sdk.platform && (
              <div>
                <p className='mb-1 font-medium text-muted-foreground text-sm'>{t('sdks.modal.platform')}</p>
                <p className='text-base'>{sdk.platform}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Documentation Section */}
          <div className='space-y-3'>
            <h4 className='font-semibold text-lg'>{t('sdks.modal.documentation')}</h4>
            <p className='text-muted-foreground text-sm'>{t('sdks.modal.documentationDescription')}</p>
            <Button variant='outline' className='w-full justify-start' onClick={handleDocumentation}>
              <FileText className='mr-2 size-4' />
              {t('sdks.modal.viewDocumentation')}
              <ExternalLink className='ml-auto size-4' />
            </Button>
          </div>

          <Separator />

          {/* Download Section */}
          <div className='space-y-3'>
            <h4 className='font-semibold text-lg'>{t('sdks.modal.download')}</h4>
            <p className='text-muted-foreground text-sm'>{t('sdks.modal.downloadDescription')}</p>
            <div className='flex flex-col gap-2 sm:flex-row'>
              <Button className='flex-1' onClick={handleDownload} disabled={!sdk.downloadUrl}>
                <Download className='mr-2 size-4' />
                {t('sdks.modal.downloadSDK')}
              </Button>
              <Button variant='outline' className='flex-1' onClick={handleGithub} disabled={!sdk.githubUrl}>
                <Github className='mr-2 size-4' />
                {t('sdks.modal.viewOnGithub')}
                <ExternalLink className='ml-2 size-4' />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            {t('sdks.modal.close', { defaultValue: 'Close' })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SDKDetailModalUi;
