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
  actionType: 'create' | 'update' | 'delete' | 'activate' | 'deactivate' | null;
};

const WalletAddressFormContainer = (props: WalletAddressFormContainerProps) => {
  const { t, isLoading, form, options, cryptoOptions, onCloseDialog, onSubmit, onSubmitDialog } =
    useWalletAddressFormContainer(props);

  return (
    <Modal
      title={t(`dialogs.${props.actionType ?? 'create'}.title`)}
      description={t(`dialogs.${props.actionType ?? 'create'}.description`)}
      isOpen={!!props.open}
      onClose={onCloseDialog}
    >
      <FormWrapper form={form} onSubmit={onSubmit}>
        <div className='space-y-4'>
          <Show when={['create', 'update'].includes(props.actionType ?? '')}>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <FormSelect
                control={form.control}
                name='chain'
                label={t('fields.chain.label')}
                placeholder={t('fields.chain.placeholder')}
                options={options}
                disabled={isLoading || props.actionType === 'update'}
                required
                selectClassName='w-full'
              />
              <FormSelect
                control={form.control}
                name='crypto'
                label={t('fields.crypto.label')}
                placeholder={t('fields.crypto.placeholder')}
                options={cryptoOptions}
                disabled={isLoading || props.actionType === 'update'}
                required
                selectClassName='w-full'
              />
            </div>
            <FormInput
              control={form.control}
              disabled={isLoading}
              name='label'
              label={t('fields.label.label')}
              placeholder={t('fields.label.placeholder')}
              required
            />
            <FormInput
              control={form.control}
              disabled={isLoading || props.actionType === 'update'}
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
