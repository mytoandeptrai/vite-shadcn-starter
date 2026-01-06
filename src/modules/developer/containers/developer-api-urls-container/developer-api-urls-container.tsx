import { FormWrapper } from '@/components/ui/form';
import { Modal } from '@/components/ui/modal';
import DeveloperApiUrlsFormUi from '../../components/developer-api-urls-form-ui';
import DeveloperApiUrlsInputUi from '../../components/developer-api-urls-input-ui';
import { useDeveloperApiUrlsContainer } from '../../hooks';

const DeveloperApiUrlsContainer = () => {
  const { t, createdAt, isLoading, notifyUrl, returnUrl, isOpenDialog, form, isPending, onCloseDialog, onOpenDialog, submit } =
    useDeveloperApiUrlsContainer();
  return (
    <div>
      <DeveloperApiUrlsInputUi
        isLoading={isLoading}
        notifyUrl={notifyUrl}
        returnUrl={returnUrl}
        createdAt={createdAt}
        onOpenDialog={onOpenDialog}
      />
      <Modal
        isOpen={isOpenDialog}
        onClose={onCloseDialog}
        title={t('api-urls.dialogs.update-urls.title')}
        description={t('api-urls.dialogs.update-urls.description')}
      >
        <FormWrapper form={form} onSubmit={submit}>
          <DeveloperApiUrlsFormUi isLoading={isLoading || isPending} onClose={onCloseDialog} />
        </FormWrapper>
      </Modal>
    </div>
  );
};

export default DeveloperApiUrlsContainer;
