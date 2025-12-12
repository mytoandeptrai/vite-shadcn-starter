import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Spinner } from '@/components/ui/spinner';
import { Show } from '@/components/utilities';
import { useTranslation } from '@/integrations/i18n';

type SystemTwoFaRemoveModalProps = {
  open: boolean;
  onClose: () => void;
  isLoading?: boolean;
  onSubmit: () => void;
};

const SystemTwoFaRemoveModal = ({ open, onClose, onSubmit, isLoading }: SystemTwoFaRemoveModalProps) => {
  const { t } = useTranslation('settings-page');
  return (
    <Modal
      title={t('system.labels.two-fa.remove-modal.title')}
      description={t('system.labels.two-fa.remove-modal.description')}
      isOpen={open}
      onClose={onClose}
    >
      <div className='flex items-center justify-between gap-2'>
        <Button className='w-1/2' size='lg' type='button' variant='outline' disabled={isLoading} onClick={onClose}>
          {t('buttons.cancel', { ns: 'common' })}
        </Button>
        <Button className='w-1/2' size='lg' type='button' disabled={isLoading} onClick={onSubmit}>
          <Show when={isLoading}>
            <Spinner />
          </Show>
          {t('buttons.ok', { ns: 'common' })}
        </Button>
      </div>
    </Modal>
  );
};

export default SystemTwoFaRemoveModal;
