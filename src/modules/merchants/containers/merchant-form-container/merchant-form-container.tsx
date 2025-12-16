import type { IMerchant } from '@/apis/merchants';
import { useMerchantFormContainer } from '../../hooks';
import { FormWrapper } from '@/components/ui/form';
import { Modal } from '@/components/ui/modal';
import { FormInput } from '@/components/form-fields/form-input';
import { Button } from '@/components/ui/button';
import { Show } from '@/components/utilities';
import { Spinner } from '@/components/ui/spinner';

type MerchantFormContainerProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: Partial<IMerchant>;
  actionType: 'create' | 'inactive' | 'active' | null;
};

const MerchantFormContainer = (props: MerchantFormContainerProps) => {
  const { t, isLoading, form, onCloseDialog, onSubmit } = useMerchantFormContainer(props);

  return (
    <Modal
      title={t(`dialogs.${props.actionType}.title`)}
      description={t(`dialogs.${props.actionType}.description`)}
      isOpen={!!props.open}
      onClose={onCloseDialog}
    >
      <FormWrapper form={form} onSubmit={onSubmit}>
        <div className='space-y-4'>
          <Show when={props.actionType === 'create'}>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <FormInput
                control={form.control}
                disabled={isLoading}
                name='firstName'
                label={t('fields.first-name.label')}
                placeholder={t('fields.first-name.placeholder')}
                required
              />
              <FormInput
                control={form.control}
                disabled={isLoading}
                name='lastName'
                label={t('fields.last-name.label')}
                placeholder={t('fields.last-name.placeholder')}
                required
              />
            </div>
            <FormInput
              control={form.control}
              disabled={isLoading}
              name='email'
              label={t('fields.email.label')}
              placeholder={t('fields.email.placeholder')}
              type='email'
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
            <Button className='w-1/2' size='lg' type='submit' disabled={isLoading}>
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

export default MerchantFormContainer;
