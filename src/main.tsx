import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import LoadingSpinner from './components/shared/loading-spinner/loading-spinner.tsx';
import { ErrorBoundary } from './components/ui/error-boundary.tsx';
import { Toaster } from './components/ui/sonner.tsx';
import * as I18nProvider from './integrations/i18n/root-provider';
import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx';
import { ThemeProvider } from './integrations/theme/theme-provider.tsx';
import reportWebVitals from './reportWebVitals.ts';
// Import the generated route tree
import { routeTree } from './routeTree.gen';
import './styles.css';
import { AuthProvider, useAuthContext } from './integrations/auth/auth-provider.tsx';

// Create a new router instance

export const TanStackQueryProviderContext = TanStackQueryProvider.getContext();
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
    auth: undefined!,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuthContext();
  return <RouterProvider router={router} context={{ auth }} />;
}

// Render the app
const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <I18nProvider.Provider>
        <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
          <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
            <ErrorBoundary>
              <Suspense fallback={<LoadingSpinner />}>
                <AuthProvider>
                  <InnerApp />
                  <Toaster richColors position='top-right' />
                </AuthProvider>
              </Suspense>
            </ErrorBoundary>
          </ThemeProvider>
        </TanStackQueryProvider.Provider>
      </I18nProvider.Provider>
    </StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
