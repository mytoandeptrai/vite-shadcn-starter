import { KBarAnimator, KBarPortal, KBarPositioner, KBarProvider, KBarSearch } from 'kbar';
import { useMemo } from 'react';
import RenderResults from './render-result';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from '@/integrations/i18n';
import { navItems } from '@/components/layouts/app-sidebar/app-sidebar.config';

export default function KBar({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // These action are for the navigation
  const actions = useMemo(() => {
    // Define navigateTo inside the useMemo callback to avoid dependency array issues
    const navigateTo = (url: string) => {
      navigate({ to: url });
    };

    return navItems(t).flatMap((navItem) => {
      // Only include base action if the navItem has a real URL and is not just a container
      const baseAction =
        navItem.url !== '#'
          ? {
              id: `${navItem.title.toLowerCase()}Action`,
              name: navItem.title,
              shortcut: navItem.shortcut,
              keywords: navItem.title.toLowerCase(),
              section: 'Navigation',
              subtitle: t('navigation.go-to', { page: navItem.title }),
              perform: () => navigateTo(navItem.url),
            }
          : null;

      // Map child items into actions
      const childActions =
        navItem.items?.map((childItem) => ({
          id: `${childItem.title.toLowerCase()}Action`,
          name: childItem.title,
          shortcut: childItem.shortcut,
          keywords: childItem.title.toLowerCase(),
          section: navItem.title,
          subtitle: t('navigation.go-to', { page: childItem.title }),
          perform: () => navigateTo(childItem.url),
        })) ?? [];

      // Return only valid actions (ignoring null base actions for containers)
      return baseAction ? [baseAction, ...childActions] : childActions;
    });
  }, [navigate, t]);

  return (
    <KBarProvider actions={actions}>
      <KBarComponent>{children}</KBarComponent>
    </KBarProvider>
  );
}
const KBarComponent = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <KBarPortal>
        <KBarPositioner className='fixed inset-0 z-99999 bg-background/80 p-0! backdrop-blur-sm'>
          <KBarAnimator className='-translate-y-12! relative mt-64! w-full max-w-[600px] overflow-hidden rounded-lg border bg-card text-card-foreground shadow-lg'>
            <div className='sticky top-0 z-10 border-border border-b bg-card'>
              <KBarSearch className='w-full border-none bg-card px-6 py-4 text-lg outline-hidden focus:outline-hidden focus:ring-0 focus:ring-offset-0' />
            </div>
            <div className='max-h-[400px]'>
              <RenderResults />
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </>
  );
};
