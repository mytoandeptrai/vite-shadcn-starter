import { useFormContext } from 'react-hook-form';
import { FormInput } from '@/components/form-fields/form-input';
import { Button } from '@/components/ui/button';
import { HStack, Show } from '@/components/utilities';
import { Spinner } from '@/components/ui/spinner';
import { CustomLink } from '@/components/ui/custom-link';
import { ROUTES } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import type { ForgotPasswordFormData } from '../../hooks';

type ForgotPasswordStep_1FormUiProps = {
  isLoading?: boolean;
  onClick?: () => void
};

const ForgotPasswordStep_1FormUi = ({ isLoading = false, onClick }: ForgotPasswordStep_1FormUiProps) => {
  const { control } = useFormContext<ForgotPasswordFormData>();
  const { t } = useTranslation('forgot-password-page');
  return (
    <div className='space-y-6'>
      <FormInput
        control={control}
        disabled={isLoading}
        name='email'
        label={t('fields.email.label')}
        placeholder={t('fields.email.placeholder')}
        required
      />
      <Button className='w-full' size='lg' type='button' disabled={isLoading} onClick={onClick}>
        <Show when={isLoading}>
          <Spinner />
        </Show>
        {t('buttons.continue')}
      </Button>
      <HStack noWrap spacing={0} align="center" justify="center" className='text-sm'>
        <span className='inline-block'>{t('labels.return-to')}</span>
        <CustomLink
          to={ROUTES.LOGIN}
          className='cursor-pointer px-1 underline hover:text-primary'
        >
          {t('labels.login-page')}
        </CustomLink>
      </HStack>
    </div>
  );
};

export default ForgotPasswordStep_1FormUi;
