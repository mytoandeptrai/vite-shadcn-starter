import { router } from '@/main';
import type { NavigateOptions } from '@tanstack/react-router';

interface ToastLinkProps {
  to: string;
  search?: NavigateOptions['search'];
  children: React.ReactNode;
  className?: string;
}

/**
 * A Link component that works inside toast messages without requiring RouterProvider context.
 * Uses the router instance directly instead of hooks.
 */
export const ToastLink = ({ to, search, children, className = 'hover:underline' }: ToastLinkProps) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.navigate({ to, search } as NavigateOptions);
  };

  return (
    <a href={to} className={className} onClick={handleClick}>
      {children}
    </a>
  );
};
