import type { IMerchant } from '@/apis/marketplace';
import { FormWrapper } from '@/components/ui/form';
import { Modal } from '@/components/ui/modal';
import MerchantFormUi from '../../components/merchant-form-ui';
import { useMerchantFormContainer, type ActionType } from '../../hooks';
import MerchantFormAddressContainer from '../merchant-form-address-container';

type MerchantFormContainerProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: Partial<IMerchant>;
  actionType: ActionType;
};

const MerchantFormContainer = (props: MerchantFormContainerProps) => {
  const {
    t,
    isLoading,
    form,
    initialAddressData,
    onCloseDialog,
    onSubmit,
    onAddWalletAddress,
    onCloseWalletForm,
    onUpdateWalletAddress,
  } = useMerchantFormContainer(props);

  return (
    <Modal
      title={t(`dialogs.${props.actionType ?? 'create'}.title`)}
      description={t(`dialogs.${props.actionType ?? 'create'}.description`)}
      isOpen={!!props.open}
      onClose={onCloseDialog}
    >
      <FormWrapper form={form} onSubmit={onSubmit}>
        <MerchantFormUi
          actionType={props.actionType}
          isLoading={isLoading}
          onClose={onCloseDialog}
          onAdd={onAddWalletAddress}
          onEdit={onUpdateWalletAddress}
        />
      </FormWrapper>

      <MerchantFormAddressContainer
        open={!!initialAddressData}
        initialData={initialAddressData}
        onClose={onCloseWalletForm}
        onSuccess={onCloseWalletForm}
      />
    </Modal>
  );
};

export default MerchantFormContainer;
