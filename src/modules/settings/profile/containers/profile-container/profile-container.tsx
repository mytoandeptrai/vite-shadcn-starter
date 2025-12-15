import { PageContainer } from '@/components/containers';
import { useTranslation } from '@/integrations/i18n';
import ProfileAvatarContainer from '../profile-avatar-container';
import ProfilePersonalContainer from '../profile-personal-container';
import ProfilePasswordContainer from '../profile-password-container';

const ProfileContainer = () => {
  const { t } = useTranslation('settings-page');

  return (
    <PageContainer pageTitle={t('profile.title')} pageDescription={t('profile.description')}>
      <div className='space-y-6'>
        <ProfileAvatarContainer />
        <ProfilePersonalContainer />
        <ProfilePasswordContainer />
      </div>
    </PageContainer>
  );
};

export default ProfileContainer;
