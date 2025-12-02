import { Outlet } from '@tanstack/react-router';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { GoogleAnalytics } from '@/components/ui/google-analytics';
import NavigationProgress from '@/components/ui/navigation-progress';
import { siteConfig } from '@/constant';
import type { FCC } from '@/types';
import AppHeader from '../app-header';

type AppLayoutProps = {};

const AppLayout: FCC<AppLayoutProps> = () => {
  return (
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

      {/* Main Content  */}
      <section className='flex min-h-screen flex-col'>
        <NavigationProgress />
        <AppHeader />
        <main className='flex-1'>
          <Outlet />
        </main>
      </section>
    </HelmetProvider>
  );
};

export default AppLayout;
