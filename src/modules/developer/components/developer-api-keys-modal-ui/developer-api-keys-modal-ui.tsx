import type { CreateApiKeyParams } from '@/apis/api-keys/types';
import { FormCheckboxGroup, type CheckboxGroupOption } from '@/components/form-fields/form-checkbox-group';
import { FormInput } from '@/components/form-fields/form-input';
import { FormSelect, type FormOption } from '@/components/form-fields/form-select';
import { Button } from '@/components/ui/button';
import { FormWrapper } from '@/components/ui/form';
import { Modal } from '@/components/ui/modal';
import { Spinner } from '@/components/ui/spinner';
import { Show } from '@/components/utilities';
import type { TFunction } from 'i18next';
import { useMemo } from 'react';
import { useDeveloperApiKeyForm } from '../../hooks';

export type DeveloperApiKeysModalUiProps = {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: CreateApiKeyParams) => void;
};

const ENVIRONMENT_OPTIONS = (t: TFunction): FormOption[] => [
  {
    value: 'production',
    label: t('api-keys.options.environment.production'),
    disabled: false
  },
  {
    value: 'development',
    label: t('api-keys.options.environment.development'),
    disabled: true
  },
];

const EXPIRES_IN_OPTIONS = (t: TFunction): FormOption[] => [
  {
    value: '30',
    label: t('api-keys.options.expiresIn.30'),
  },
  {
    value: '90',
    label: t('api-keys.options.expiresIn.90'),
  },
  {
    value: '180',
    label: t('api-keys.options.expiresIn.180'),
  },
  {
    value: '365',
    label: t('api-keys.options.expiresIn.365'),
  },
];

const PERMISSIONS_OPTIONS = (t: TFunction): CheckboxGroupOption[] => [
  {
    value: 'orders:read',
    label: t('api-keys.options.permissions.orders-read'),
  },
  {
    value: 'orders:write',
    label: t('api-keys.options.permissions.orders-write'),
  },
  {
    value: 'transactions:read',
    label: t('api-keys.options.permissions.transactions-read'),
  },
  {
    value: 'transactions:write',
    label: t('api-keys.options.permissions.transactions-write'),
  },
  {
    value: 'wallet:read',
    label: t('api-keys.options.permissions.wallet-read'),
  },
  {
    value: 'wallet:write',
    label: t('api-keys.options.permissions.wallet-write'),
  },
];

const DeveloperApiKeysModalUi = ({ isLoading, isOpen, onClose, onSubmit }: DeveloperApiKeysModalUiProps) => {
  const { t, form, submit, onCloseDialog } = useDeveloperApiKeyForm({
    isLoading,
    isOpen,
    onClose,
    onSubmit,
  });

  const options = useMemo(() => {
    return {
      environment: ENVIRONMENT_OPTIONS(t),
      expiresIn: EXPIRES_IN_OPTIONS(t),
      permissions: PERMISSIONS_OPTIONS(t),
    };
  }, [t]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCloseDialog}
      title={t('api-keys.dialogs.generate-new-key.title')}
      description={t('api-keys.dialogs.generate-new-key.description')}
    >
      <FormWrapper className='space-y-4' form={form} onSubmit={submit}>
        <div className='grid grid-cols-1 items-start gap-4 md:grid-cols-2'>
          <FormSelect
            control={form.control}
            name='environment'
            label={t('api-keys.dialogs.generate-new-key.fields.environment.label')}
            placeholder={t('api-keys.dialogs.generate-new-key.fields.environment.placeholder')}
            fullWidth
            options={options.environment}
            required
            disabled={isLoading}
          />

          <FormSelect
            control={form.control}
            name='expiresIn'
            fullWidth
            label={t('api-keys.dialogs.generate-new-key.fields.expiresIn.label')}
            placeholder={t('api-keys.dialogs.generate-new-key.fields.expiresIn.placeholder')}
            options={options.expiresIn}
            required
            disabled={isLoading}
          />
        </div>
        <FormInput
          control={form.control}
          name='name'
          label={t('api-keys.dialogs.generate-new-key.fields.name.label')}
          placeholder={t('api-keys.dialogs.generate-new-key.fields.name.placeholder')}
          required
          disabled={isLoading}
        />

        <FormCheckboxGroup
          control={form.control}
          name='permissions'
          label={t('api-keys.dialogs.generate-new-key.fields.permissions.label')}
          options={options.permissions}
          required
          disabled={isLoading}
          columns={2}
        />

        <div className='flex items-center justify-between gap-2 pt-2'>
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
          <Button className='w-1/2' size='lg' type='submit' disabled={isLoading}>
            <Show when={isLoading}>
              <Spinner />
            </Show>
            {t('buttons.ok', { ns: 'common' })}
          </Button>
        </div>
      </FormWrapper>
    </Modal>
  );
};

export default DeveloperApiKeysModalUi;