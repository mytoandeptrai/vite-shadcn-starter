import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserAvatarProfile } from '@/components/ui/user-avatar-profile';
import { useAuthContext } from '@/integrations/auth/auth-provider';
import AppHeaderSearch from './app-header-search';

export default function AppHeader() {
  const { user } = useAuthContext();
  return (
    <header className='flex h-16 shrink-0 items-center justify-between gap-2'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 data-[orientation=vertical]:h-4' />
        <AppHeaderSearch />
      </div>
      <div className='flex items-center gap-3 pr-4'>
        <UserAvatarProfile user={user} />
      </div>
    </header>
  );
}
