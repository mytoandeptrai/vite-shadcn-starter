import AppHeader from "@/components/layouts/app-header";
import AppSidebar from "@/components/layouts/app-sidebar";
import NotFoundPage from "@/components/ui/not-found";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ROUTES } from "@/constant";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)")({
  beforeLoad: ({ context }) => {
    const auth = context.auth;
    if (!auth.isAuthenticated) {
      throw redirect({
        to: ROUTES.LOGIN,
      });
    }
  },
  component: RouteComponent,
  notFoundComponent: NotFoundPage,
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
