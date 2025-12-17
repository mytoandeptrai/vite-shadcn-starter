import { ROUTES } from '@/constant';
import type { FileWithPreview } from '@/hooks/use-file-upload';
import { useAuthContext } from '@/integrations/auth/auth-provider';
import { useTranslation } from '@/integrations/i18n';
import { Link } from '@tanstack/react-router';
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
        <Link to={ROUTES.SYSTEM} className='hover:underline'>
          {t('messages.require-enable-two-fa', { ns: 'common' })}
        </Link>
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
