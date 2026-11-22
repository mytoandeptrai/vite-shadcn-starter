import { GoogleAnalytics } from '@/components/ui/google-analytics';
import NavigationProgress from '@/components/ui/navigation-progress';
import { Show } from '@/components/utilities';
import { env } from '@/constant';
import type { AuthContextState } from '@/integrations/auth/auth-provider';
import { TanStackDevtools } from '@tanstack/react-devtools';
import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools';

interface MyRouterContext {
  queryClient: QueryClient;
  auth: AuthContextState;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <GoogleAnalytics />
      <NavigationProgress />
      <Outlet />
      <Show when={env.ENVIRONMENT === 'dev'}>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[TanStackQueryDevtools]}
        />
      </Show>
    </>
  ),
});
