import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserAvatarProfile } from '@/components/ui/user-avatar-profile';
import { useAuthContext } from '@/integrations/auth/auth-provider';
import AppHeaderSearch from './app-header-search';

export default function AppHeader() {
  const { user } = useAuthContext();
  return (
    <header className='fixed top-0 z-999 flex h-16 w-[calc(100%-255px)] shrink-0 items-center justify-between gap-2 bg-background'>
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
