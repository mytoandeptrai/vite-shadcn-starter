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
import type { ISDK } from '../../types/sdk.types';
import { ExternalLink, Download, Github, FileText } from 'lucide-react';

type SDKDetailModalUiProps = {
  sdk: ISDK | null;
  isOpen: boolean;
  onClose: () => void;
};

const SDKDetailModalUi = ({ sdk, isOpen, onClose }: SDKDetailModalUiProps) => {
  const { t } = useTranslation('developer-page');

  if (!sdk) return null;

  const handleDownload = () => {
    window.open(sdk.downloadUrl, '_blank');
  };

  const handleDocumentation = () => {
    window.open(sdk.documentationUrl, '_blank');
  };

  const handleGithub = () => {
    if (sdk.githubUrl) {
      window.open(sdk.githubUrl, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{sdk.name}</DialogTitle>
          <DialogDescription className="text-base">
            {sdk.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* SDK Info */}
          <div className="space-y-4">
            {sdk.version && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {t('sdks.modal.version')}
                </p>
                <p className="text-base">{sdk.version}</p>
              </div>
            )}

            {sdk.language && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {t('sdks.modal.language')}
                </p>
                <p className="text-base">{sdk.language}</p>
              </div>
            )}

            {sdk.platform && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {t('sdks.modal.platform')}
                </p>
                <p className="text-base">{sdk.platform}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Documentation Section */}
          <div className="space-y-3">
            <h4 className="font-semibold text-lg">{t('sdks.modal.documentation')}</h4>
            <p className="text-sm text-muted-foreground">{t('sdks.modal.documentationDescription')}</p>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleDocumentation}
            >
              <FileText className="mr-2 size-4" />
              {t('sdks.modal.viewDocumentation')}
              <ExternalLink className="ml-auto size-4" />
            </Button>
          </div>

          <Separator />

          {/* Download Section */}
          <div className="space-y-3">
            <h4 className="font-semibold text-lg">{t('sdks.modal.download')}</h4>
            <p className="text-sm text-muted-foreground">{t('sdks.modal.downloadDescription')}</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button className="flex-1" onClick={handleDownload}>
                <Download className="mr-2 size-4" />
                {t('sdks.modal.downloadSDK')}
              </Button>
              {sdk.githubUrl && (
                <Button variant="outline" className="flex-1" onClick={handleGithub}>
                  <Github className="mr-2 size-4" />
                  {t('sdks.modal.viewOnGithub')}
                  <ExternalLink className="ml-2 size-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('sdks.modal.close', { defaultValue: 'Close' })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SDKDetailModalUi;
