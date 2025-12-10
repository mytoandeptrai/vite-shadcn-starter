import { Show } from '@/components/utilities';
import DeveloperApiKeysInputUi from '../../components/developer-api-keys-input-ui';
import { useDeveloperApiKeysContainer } from '../../hooks';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

const DeveloperApiKeysContainer = () => {
  const { t, isLoading, isOpenDialog, publicKey, secretKey, onCloseDialog, onOpenDialog } =
    useDeveloperApiKeysContainer();
  return (
    <div>
      <DeveloperApiKeysInputUi
        isLoading={isLoading}
        publicKey={publicKey}
        secretKey={secretKey}
        onOpenDialog={onOpenDialog}
      />
      <Modal
        isOpen={isOpenDialog}
        onClose={onCloseDialog}
        title={t('api-keys.dialogs.generate-new-key.title')}
        description={t('api-keys.dialogs.generate-new-key.description')}
      >
        <div className='flex items-center justify-between gap-2'>
          <Button
            className='w-1/2'
            size='lg'
            type='button'
            variant='outline'
            disabled={isLoading}
            onClick={onCloseDialog}
          >
            {t('buttons.cancel', { ns: 'common' })}
          </Button>
          <Button className='w-1/2' size='lg' type='button' disabled={isLoading} onClick={onCloseDialog}>
            <Show when={isLoading}>
              <Spinner />
            </Show>
            {t('buttons.ok', { ns: 'common' })}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default DeveloperApiKeysContainer;
