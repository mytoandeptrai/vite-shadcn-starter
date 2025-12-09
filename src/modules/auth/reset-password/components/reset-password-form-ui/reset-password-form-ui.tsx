
import { FormInput } from '@/components/form-fields/form-input';
import { useTranslation } from '@/integrations/i18n';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { CustomLink } from '@/components/ui/custom-link';
import { Show } from '@/components/utilities';
import { Spinner } from '@/components/ui/spinner';
import type { ResetPasswordFormData } from '../../hooks';
import { ROUTES } from '@/constant';

type ResetPasswordFormUiProps = {
  isLoading?: boolean;
};

const ResetPasswordFormUi = ({ isLoading = false }: ResetPasswordFormUiProps) => {
  const { control } = useFormContext<ResetPasswordFormData>();
  const { t } = useTranslation('reset-password-page');
  return (
    <div className='space-y-6'>
      <FormInput
        control={control}
        disabled={isLoading}
        name='password'
        type='password'
        label={t('fields.new-password.label')}
        placeholder={t('fields.new-password.placeholder')}
        required
      />
      <FormInput
        control={control}
        disabled={isLoading}
        name='confirmPassword'
        label={t('fields.confirmPassword.label')}
        placeholder={t('fields.confirmPassword.placeholder')}
        type='password'
        required
      />
      <Button className='w-full' size='lg' type='submit' disabled={isLoading}>
        <Show when={isLoading}>
          <Spinner />
        </Show>
        {t('buttons.reset-password')}
      </Button>
      <div className='text-center'>
        <CustomLink
          to={ROUTES.LOGIN}
          className='cursor-pointer text-center text-muted-foreground text-sm underline hover:text-primary'
        >
          {t('buttons.login-page')}
        </CustomLink>
      </div>
    </div>
  );
};

export default ResetPasswordFormUi;
