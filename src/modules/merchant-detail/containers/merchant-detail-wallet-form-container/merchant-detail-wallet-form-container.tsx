import type { IWalletAddress } from '@/apis/wallet-address';
import { FormWrapper } from '@/components/ui/form';
import { Modal } from '@/components/ui/modal';
import MerchantDetailWalletFormUi from '../../components/merchant-detail-wallet-form-ui';
import { useMerchantWalletFormContainer, type WalletActionType } from '../../hooks';

export type MerchantDetailWalletFormContainerProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: Partial<IWalletAddress>;
  actionType: WalletActionType;
  merchantId: string;
};

const MerchantDetailWalletFormContainer = (props: MerchantDetailWalletFormContainerProps) => {
  const { t, isLoading, open, form, options, cryptoOptions, actionType, onCloseDialog, onSubmit } =
    useMerchantWalletFormContainer(props);

  return (
    <Modal
      title={t(`wallet-management.dialogs.${actionType}.title`, {
        ns: 'merchant-detail-page',
      })}
      description={t(`wallet-management.dialogs.${actionType}.description`, {
        ns: 'merchant-detail-page',
      })}
      isOpen={open}
      onClose={onCloseDialog}
    >
      <FormWrapper form={form} onSubmit={onSubmit}>
        <MerchantDetailWalletFormUi
          isLoading={isLoading}
          options={options}
          tokenOptions={cryptoOptions}
          actionType={actionType}
          onClose={onCloseDialog}
        />
      </FormWrapper>
    </Modal>
  );
};

export default MerchantDetailWalletFormContainer;
