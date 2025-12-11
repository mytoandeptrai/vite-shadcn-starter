import { Separator } from '@/components/ui/separator';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { UserAvatarProfile } from '@/components/ui/user-avatar-profile';
import { useAuthContext } from '@/integrations/auth/auth-provider';
import AppHeaderSearch from './app-header-search';
import { cn } from '@/lib/utils';

export default function AppHeader() {
  const { user } = useAuthContext();
  const { open, isMobile } = useSidebar();
  return (
    <header
      className={cn(
        'fixed top-0 z-10 flex h-16 w-[calc(100vw-var(--sidebar-width))] shrink-0 items-center justify-between gap-2 bg-background',
        {
          'w-[calc(100vw-var(--sidebar-width-icon))]': !open,
          'w-full': isMobile,
        }
      )}
    >
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
