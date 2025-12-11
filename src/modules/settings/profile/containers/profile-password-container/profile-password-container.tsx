import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfilePasswordContainer } from '../../hooks';
import { FormWrapper } from '@/components/ui/form';
import { FormInput } from '@/components/form-fields/form-input';
import { Button } from '@/components/ui/button';
import { Show } from '@/components/utilities';
import { Spinner } from '@/components/ui/spinner';

const ProfilePasswordContainer = () => {
  const { t, form, isLoading, isUpdated, onSubmit, onCancel, setIsUpdated } = useProfilePasswordContainer();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('profile.password.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <FormWrapper className='space-y-6' form={form} onSubmit={onSubmit}>
          <FormInput
            control={form.control}
            name='newPassword'
            label={t('profile.password.fields.new-password.label')}
            placeholder={t('profile.password.fields.new-password.placeholder')}
            required
            disabled={isLoading || !isUpdated}
            type='password'
          />
          <FormInput
            control={form.control}
            name='confirmNewPassword'
            type='password'
            label={t('profile.password.fields.confirmNewPassword.label')}
            placeholder={t('profile.password.fields.confirmNewPassword.placeholder')}
            required
            disabled={isLoading || !isUpdated}
          />
          <Show when={isUpdated}>
            <div className='flex items-center justify-start gap-2'>
              <Button
                className='w-fit'
                size='lg'
                type='button'
                variant='outline'
                disabled={isLoading}
                onClick={onCancel}
              >
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
            <Button className='w-fit' size='lg' type='button' disabled={isLoading} onClick={() => setIsUpdated(true)}>
              {t('profile.buttons.update-password')}
            </Button>
          </Show>
        </FormWrapper>
      </CardContent>
    </Card>
  );
};

export default ProfilePasswordContainer;
