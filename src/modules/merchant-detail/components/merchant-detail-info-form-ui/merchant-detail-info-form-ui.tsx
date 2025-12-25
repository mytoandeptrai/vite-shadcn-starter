import { FormInput } from '@/components/form-fields/form-input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Show } from '@/components/utilities';
import { useTranslation } from '@/integrations/i18n';
import { useFormContext } from 'react-hook-form';

type MerchantDetailInfoFormUiProps = {
  isLoading: boolean;
  isUpdated: boolean;
  onCancel: () => void;
  onEdit: () => void;
};

const MerchantDetailInfoFormUi = ({ isLoading, isUpdated, onCancel, onEdit }: MerchantDetailInfoFormUiProps) => {
  const { t } = useTranslation('merchant-detail-page');
  const { control } = useFormContext();

  return (
    <>
      <div className='grid grid-cols-1 items-start gap-4 md:grid-cols-2'>
        <FormInput
          control={control}
          name='firstName'
          label={t('merchant-info.fields.firstName.label')}
          placeholder={t('merchant-info.fields.firstName.placeholder')}
          required
          disabled={isLoading || !isUpdated}
        />
        <FormInput
          control={control}
          name='lastName'
          label={t('merchant-info.fields.lastName.label')}
          placeholder={t('merchant-info.fields.lastName.placeholder')}
          required
          disabled={isLoading || !isUpdated}
        />
      </div>
      <FormInput
        control={control}
        name='email'
        label={t('merchant-info.fields.email.label')}
        placeholder={t('merchant-info.fields.email.placeholder')}
        required
        disabled={isLoading || !isUpdated}
      />
      <Show when={isUpdated}>
        <div className='flex items-center justify-start gap-2'>
          <Button className='w-fit' size='lg' type='button' variant='outline' disabled={isLoading} onClick={onCancel}>
            {t('buttons.cancel', { ns: 'common' })}
          </Button>
          <Button className='w-fit' size='lg' type='submit' disabled={isLoading}>
            <Show when={isLoading}>
              <Spinner />
            </Show>
            {t('buttons.update', { ns: 'common' })}
          </Button>
        </div>
      </Show>
      <Show when={!isUpdated}>
        <Button className='w-fit' size='lg' type='button' disabled={isLoading} onClick={onEdit}>
          {t('merchant-info.buttons.edit')}
        </Button>
      </Show>
    </>
  );
};

export default MerchantDetailInfoFormUi;
