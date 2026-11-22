import { Outlet } from '@tanstack/react-router';
import { HelmetProvider } from 'react-helmet-async';
import { GoogleAnalytics } from '@/components/ui/google-analytics';
import NavigationProgress from '@/components/ui/navigation-progress';
import type { FCC } from '@/types';
import AppHeader from '../app-header';

type AppLayoutProps = {};

const AppLayout: FCC<AppLayoutProps> = () => {
  return (
    <HelmetProvider>
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
