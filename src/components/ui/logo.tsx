import { siteConfig } from '@/constant';
import { cn } from '@/lib/utils';

interface LogoProps {
  /** Force the light-on-dark artwork instead of following the theme. */
  onDark?: boolean;
  className?: string;
}

const SIZE = { width: 338, height: 64 };

/** The jacobhocoto lockup: steering-wheel mark plus wordmark. */
export function Logo({ onDark = false, className }: LogoProps) {
  if (onDark) {
    return <img src='/logo.svg' alt={siteConfig.name} {...SIZE} className={cn('h-9 w-auto', className)} />;
  }
  return (
    <>
      <img src='/logo-dark.svg' alt={siteConfig.name} {...SIZE} className={cn('h-9 w-auto dark:hidden', className)} />
      <img src='/logo.svg' alt='' aria-hidden {...SIZE} className={cn('hidden h-9 w-auto dark:block', className)} />
    </>
  );
}
