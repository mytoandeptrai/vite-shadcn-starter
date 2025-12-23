import { useCreateApiKey } from '@/apis/api-keys';
import { useTranslation } from '@/integrations/i18n';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { DeveloperApiKeysModalUiProps } from '../components/developer-api-keys-modal-ui';
import { developerApiKeyFormSchema, initialApiKeyFormData, type DeveloperApiKeyFormData } from './schema';
import { useDialogContext } from '@/integrations/dialog/dialog-provider';
import { toast } from 'sonner';

export const useDeveloperApiKeyForm = ({ isOpen, onClose, onSubmit }: DeveloperApiKeysModalUiProps) => {
  const { t } = useTranslation('developer-page');

  const { onOpenTwoFAModal, onCloseModal } = useDialogContext();

  const createApiKeyMutation = useCreateApiKey();
  const isLoading = createApiKeyMutation.isPending;

  const form = useForm<DeveloperApiKeyFormData>({
    resolver: zodResolver(developerApiKeyFormSchema(t)),
    defaultValues: initialApiKeyFormData,
    mode: 'onChange',
  });

  const submit = async (data: DeveloperApiKeyFormData) => {
    if (isLoading) return;
    onOpenTwoFAModal({
      forceOpen: true,
      skipInitVerification: true,
      isLoading: isLoading,
      closeOnSubmit: false,
      cb: async (code) => {
        const payload = {
          name: data.name,
          environment: data.environment,
          expiresIn: Number(data.expiresIn),
          permissions: data.permissions,
          twoFACode: code!,
        };
        await createApiKeyMutation.mutateAsync(payload);
        toast.success(t('api-keys.messages.generate-new-key-success'));
        onCloseModal();
        onSubmit?.(payload);
      },
    });
  };

  const onCloseDialog = () => {
    form.reset();
    onClose?.();
  };

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  return {
    t,
    form,
    submit,
    onCloseDialog,
  };
};
