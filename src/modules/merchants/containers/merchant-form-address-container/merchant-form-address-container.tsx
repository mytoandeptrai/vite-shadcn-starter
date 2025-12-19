import { FormWrapper } from '@/components/ui/form';
import { Modal } from '@/components/ui/modal';
import type { WalletAddressCreateFormData } from '@/modules/wallet-address/hooks/schema';
import MerchantFormAddressUi from '../../components/merchant-form-address-ui';
import { useMerchantFormAddressContainer } from '../../hooks';

export type MerchantFormAddressContainerProps = {
  open: boolean;
  initialData?: WalletAddressCreateFormData;
  onClose: () => void;
  onSuccess: () => void;
};

const MerchantFormAddressContainer = (props: MerchantFormAddressContainerProps) => {
  const { t, isEdit, open, form, options, tokenOptions, onCloseDialog, onSubmit } =
    useMerchantFormAddressContainer(props);
  return (
    <Modal
      title={t(`dialogs.${isEdit ? 'update-merchant-wallet' : 'create-merchant-wallet'}.title`, {
        ns: 'merchants-page',
      })}
      description={t(`dialogs.${isEdit ? 'update-merchant-wallet' : 'create-merchant-wallet'}.description`, {
        ns: 'merchants-page',
      })}
      isOpen={open}
      onClose={onCloseDialog}
    >
      <FormWrapper form={form} onSubmit={onSubmit}>
        <MerchantFormAddressUi options={options} tokenOptions={tokenOptions} onClose={onCloseDialog} />
      </FormWrapper>
    </Modal>
  );
};

export default MerchantFormAddressContainer;
