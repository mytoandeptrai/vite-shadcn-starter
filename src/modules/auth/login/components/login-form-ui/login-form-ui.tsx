import { FormInput } from '@/components/form-fields/form-input';
import { useTranslation } from '@/integrations/i18n';
import { useFormContext } from 'react-hook-form';
import type { LoginFormData } from '../../hooks';
import { Button } from '@/components/ui/button';
import { CustomLink } from '@/components/ui/custom-link';
import { ROUTES } from '@/constant';
import { Show } from '@/components/utilities';
import { Spinner } from '@/components/ui/spinner';

type LoginFormUiProps = {
  isLoading?: boolean;
};

const LoginFormUi = ({ isLoading = false }: LoginFormUiProps) => {
  const { control } = useFormContext<LoginFormData>();
  const { t } = useTranslation('login-page');
  return (
    <div className='space-y-4'>
      <FormInput
        control={control}
        disabled={isLoading}
        name='email'
        label={t('fields.email.label')}
        placeholder={t('fields.email.placeholder')}
        required
      />
      <FormInput
        control={control}
        disabled={isLoading}
        name='password'
        type='password'
        label={t('fields.password.label')}
        placeholder={t('fields.password.placeholder')}
        required
      />
      <div className='text-end'>
        <CustomLink to={ROUTES.FORGOT_PASSWORD} className='text-sm hover:text-primary'>
          {t('labels.forgotPassword')}
        </CustomLink>
      </div>
      <Button className='w-full' size='lg' type='submit' disabled={isLoading}>
        <Show when={isLoading}>
          <Spinner />
        </Show>
        {t('labels.login')}
      </Button>
      <div className='text-center'>
        <CustomLink
          to={ROUTES.REGISTER}
          className='cursor-pointer text-center text-muted-foreground text-sm underline hover:text-primary'
        >
          {t('labels.dontHaveAccount')}
        </CustomLink>
      </div>
    </div>
  );
};

export default LoginFormUi;
