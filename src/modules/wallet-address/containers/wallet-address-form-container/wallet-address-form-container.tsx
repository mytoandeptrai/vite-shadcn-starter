import type { IWalletAddress } from '@/apis/wallet-address';
import { useWalletAddressFormContainer } from '../../hooks';
import { FormWrapper } from '@/components/ui/form';
import { Modal } from '@/components/ui/modal';
import { FormInput } from '@/components/form-fields/form-input';
import { FormSelect } from '@/components/form-fields/form-select';
import { Button } from '@/components/ui/button';
import { Show } from '@/components/utilities';
import { Spinner } from '@/components/ui/spinner';

type WalletAddressFormContainerProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: Partial<IWalletAddress>;
  actionType: 'create' | 'update' | 'delete' | null;
};

const WalletAddressFormContainer = (props: WalletAddressFormContainerProps) => {
  const { t, isLoading, form, options, tokenOptions, onCloseDialog, onSubmit, onSubmitDialog } = useWalletAddressFormContainer(props);

  return (
    <Modal
      title={t(`dialogs.${props.actionType}.title`)}
      description={t(`dialogs.${props.actionType}.description`)}
      isOpen={!!props.open}
      onClose={onCloseDialog}
    >
      <FormWrapper form={form} onSubmit={onSubmit}>
        <div className='space-y-4'>
          <Show when={props.actionType !== 'delete'}>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormSelect
              control={form.control}
              name='chain'
              label={t('fields.blockchain.label')}
              placeholder={t('fields.blockchain.placeholder')}
              options={options}
              required
              selectClassName='w-full'
            />
            <FormSelect
              control={form.control}
              name='token'
              label={t('fields.token.label')}
              placeholder={t('fields.token.placeholder')}
              options={tokenOptions}
              required
              selectClassName='w-full'
            />
          </div>
            <FormInput
              control={form.control}
              disabled={isLoading}
              name='address'
              label={t('fields.wallet-address.label')}
              placeholder={t('fields.wallet-address.placeholder')}
              required
            />
          </Show>
          <div className='flex items-center justify-between gap-2'>
            <Button
              className='w-1/2'
              size='lg'
              type='button'
              variant='outline'
              onClick={onCloseDialog}
              disabled={isLoading}
            >
              {t('buttons.cancel', { ns: 'common' })}
            </Button>
            <Button className='w-1/2' size='lg' type='button' onClick={onSubmitDialog} disabled={isLoading}>
              <Show when={isLoading}>
                <Spinner />
              </Show>
              {t('buttons.ok', { ns: 'common' })}
            </Button>
          </div>
        </div>
      </FormWrapper>
    </Modal>
  );
};

export default WalletAddressFormContainer;
