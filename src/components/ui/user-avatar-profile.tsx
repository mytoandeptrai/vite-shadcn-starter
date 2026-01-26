import type { IUserInfo } from '@/apis/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserAvatarProfileProps {
  className?: string;
  showInfo?: boolean;
  user?: IUserInfo;
}

export function UserAvatarProfile({ className, showInfo = false, user }: UserAvatarProfileProps) {
  const name =
    user?.firstname && user?.lastname ? `${user.firstname} ${user.lastname}` : user?.firstname || user?.lastname || '';
  return (
    <div className='flex items-center gap-2'>
      <Avatar className={className}>
        <AvatarImage src={user?.imageUrl || ''} alt={name || ''} />
        <AvatarFallback className='rounded-lg'>{name?.slice(0, 2)?.toUpperCase() || 'CN'}</AvatarFallback>
      </Avatar>

      {showInfo && (
        <div className='grid flex-1 text-left text-sm leading-tight'>
          <span className='truncate font-semibold'>{name || ''}</span>
          <span className='truncate text-xs'>{user?.email || ''}</span>
        </div>
      )}
    </div>
  );
}
