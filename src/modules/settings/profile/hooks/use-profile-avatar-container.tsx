import { ROUTES } from '@/constant';
import type { FileWithPreview } from '@/hooks/use-file-upload';
import { useAuthContext } from '@/integrations/auth/auth-provider';
import { useTranslation } from '@/integrations/i18n';
import { ToastLink } from '@/components/ui/toast-link';
import { useState } from 'react';
import { toast } from 'sonner';

export const useProfileAvatarContainer = () => {
  const { t } = useTranslation('settings-page');
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const isLoading = false;

  const { user } = useAuthContext();
  const isEnabledTwoFa = user?.twoFAEnabled ?? false;

  const onSave = async () => {
    if (!isEnabledTwoFa) {
      toast.error(
        <ToastLink to={ROUTES.SYSTEM}>
          {t('messages.require-enable-two-fa', { ns: 'common' })}
        </ToastLink>
      );
      return;
    }
  };
  return {
    t,
    file,
    isLoading,
    setFile,
    onSave,
  };
};
