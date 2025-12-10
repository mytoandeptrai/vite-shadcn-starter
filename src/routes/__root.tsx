import { GoogleAnalytics } from '@/components/ui/google-analytics';
import NavigationProgress from '@/components/ui/navigation-progress';
import { siteConfig } from '@/constant';
import type { AuthContextState } from '@/integrations/auth/auth-provider';
import { TanStackDevtools } from '@tanstack/react-devtools';
import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools';

interface MyRouterContext {
  queryClient: QueryClient;
  auth: AuthContextState;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <HelmetProvider>
      {/* SEO  */}
      <Helmet>
        <title>{siteConfig.title}</title>
        <meta name='description' content={siteConfig.description} />
        <meta property='og:title' content={siteConfig.title} />
        <meta property='og:description' content={siteConfig.description} />
        <meta property='og:url' content={siteConfig.canonicalUrl} />
        <meta property='og:type' content='website' />
        <meta property='og:site_name' content={siteConfig.title} />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={siteConfig.title} />
        <meta name='twitter:description' content={siteConfig.description} />
        <meta name='twitter:site' content={siteConfig.twitter} />
        <link rel='canonical' href={siteConfig.canonicalUrl} />
        <meta name='robots' content='noindex,nofollow' />
      </Helmet>
      <GoogleAnalytics />
      <NavigationProgress />
      <Outlet />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[TanStackQueryDevtools]}
      />
    </HelmetProvider>
  ),
});
