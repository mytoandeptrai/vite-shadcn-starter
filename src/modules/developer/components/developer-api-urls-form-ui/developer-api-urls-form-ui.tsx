import { useFormContext } from 'react-hook-form';
import type { DeveloperApiUrlsFormData } from '../../hooks';
import { FormInput } from '@/components/form-fields/form-input';
import { useTranslation } from '@/integrations/i18n';
import { Button } from '@/components/ui/button';
import { Show } from '@/components/utilities';
import { Spinner } from '@/components/ui/spinner';

type DeveloperApiUrlsFormUiProps = {
  isLoading?: boolean;
  onClose?: () => void;
};

const DeveloperApiUrlsFormUi = ({ isLoading = false, onClose }: DeveloperApiUrlsFormUiProps) => {
  const { control } = useFormContext<DeveloperApiUrlsFormData>();
  const { t } = useTranslation('developer-page');
  return (
    <div className='space-y-6'>
      <FormInput
        control={control}
        name='notifyUrl'
        label={t('api-urls.dialogs.update-urls.fields.notify-url.label')}
        placeholder={t('api-urls.dialogs.update-urls.fields.notify-url.placeholder')}
        required
      />
      <FormInput
        control={control}
        name='returnUrl'
        label={t('api-urls.dialogs.update-urls.fields.return-url.label')}
        placeholder={t('api-urls.dialogs.update-urls.fields.return-url.placeholder')}
        required
      />
      <div className='flex items-center justify-between gap-2'>
        <Button className='w-1/2' size='lg' type='button' variant='outline' disabled={isLoading} onClick={onClose}>
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
  );
};

export default DeveloperApiUrlsFormUi;
