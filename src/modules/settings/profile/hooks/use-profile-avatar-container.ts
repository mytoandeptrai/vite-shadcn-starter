import type { FileWithPreview } from '@/hooks/use-file-upload';
import { useTranslation } from '@/integrations/i18n';
import { useState } from 'react';

export const useProfileAvatarContainer = () => {
  const { t } = useTranslation('settings-page');
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const isLoading = false;
  const onSave = async () => {};
  return {
    t,
    file,
    isLoading,
    setFile,
    onSave,
  };
};