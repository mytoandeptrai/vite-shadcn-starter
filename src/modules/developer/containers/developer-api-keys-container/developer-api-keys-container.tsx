import DeveloperApiKeysInputUi from '../../components/developer-api-keys-input-ui';
import DeveloperApiKeysModalUi from '../../components/developer-api-keys-modal-ui';
import { useDeveloperApiKeysContainer } from '../../hooks';

const DeveloperApiKeysContainer = () => {
  const { isLoading, isOpenDialog, publicKey, createdAt, secretKey, onCloseDialog, onOpenDialog, onSuccess } =
    useDeveloperApiKeysContainer();

  return (
    <div>
      <DeveloperApiKeysInputUi
        createdAt={createdAt}
        isLoading={isLoading}
        publicKey={publicKey}
        secretKey={secretKey}
        onOpenDialog={onOpenDialog}
      />
      <DeveloperApiKeysModalUi
        isLoading={isLoading}
        isOpen={isOpenDialog}
        onClose={onCloseDialog}
        onSubmit={onSuccess}
      />
    </div>
  );
};

export default DeveloperApiKeysContainer;
