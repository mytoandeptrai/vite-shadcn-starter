import AvatarUpload from '@/components/ui/avatar-upload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Show } from '@/components/utilities';
import { useProfileAvatarContainer } from '../../hooks';
import { Spinner } from '@/components/ui/spinner';

const ProfileAvatarContainer = () => {
  const { t, file, isLoading, onSave, setFile } = useProfileAvatarContainer();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('profile.avatar.title')}</CardTitle>
        <CardDescription>{t('profile.avatar.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <AvatarUpload onFileChange={setFile} defaultAvatar={file?.preview} />
      </CardContent>
      <Show when={!!file?.preview}>
        <CardFooter>
          <Button onClick={onSave} className='w-fit' disabled={isLoading}>
            <Show when={isLoading}>
              <Spinner />
            </Show>
            {t('profile.buttons.update-avatar')}
          </Button>
        </CardFooter>
      </Show>
    </Card>
  );
};

export default ProfileAvatarContainer;
