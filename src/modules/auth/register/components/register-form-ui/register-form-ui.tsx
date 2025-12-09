import { FormInput } from '@/components/form-fields/form-input';
import { useTranslation } from '@/integrations/i18n';
import { useFormContext } from 'react-hook-form';
import type { RegisterFormData } from '../../hooks';
import { Button } from '@/components/ui/button';
import { CustomLink } from '@/components/ui/custom-link';
import { Show } from '@/components/utilities';
import { Spinner } from '@/components/ui/spinner';

type RegisterFormUiProps = {
  isLoading?: boolean;
};

const RegisterFormUi = ({ isLoading = false }: RegisterFormUiProps) => {
  const { control } = useFormContext<RegisterFormData>();
  const { t } = useTranslation('register-page');
  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 items-baseline gap-4 md:grid-cols-2'>
        <FormInput
          control={control}
          disabled={isLoading}
          name='firstName'
          label={t('fields.fullName.label')}
          placeholder={t('fields.fullName.placeholder')}
          required
        />
        <FormInput
          control={control}
          disabled={isLoading}
          name='lastName'
          label={t('fields.lastName.label')}
          placeholder={t('fields.lastName.placeholder')}
          required
        />
      </div>
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
        {t('labels.register')}
      </Button>
      <div className='text-center'>
        <CustomLink
          to='/login'
          className='cursor-pointer text-center text-muted-foreground text-sm underline hover:text-primary'
        >
          {t('labels.alreadyHaveAccount')}
        </CustomLink>
      </div>
    </div>
  );
};

export default RegisterFormUi;
