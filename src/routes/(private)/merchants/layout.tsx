import { EUserType, ROUTES } from '@/constant';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/(private)/merchants')({
  beforeLoad: ({ context }) => {
    const user = context.auth?.user;
    if (user?.type !== EUserType.MARKETPLACE) {
      throw redirect({
        to: ROUTES.DASHBOARD,
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
