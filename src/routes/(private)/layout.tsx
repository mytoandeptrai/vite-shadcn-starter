import AppHeader from '@/components/layouts/app-header';
import AppSidebar from '@/components/layouts/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ROUTES } from '@/constant';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/(private)')({
  beforeLoad: ({ context }) => {
    const auth = context.auth;
    if (!auth.isAuthenticated) {
      throw redirect({
        to: ROUTES.GETTING_STARTED,
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
