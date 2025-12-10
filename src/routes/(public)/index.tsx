import { ROUTES } from '@/constant';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/(public)/')({
  beforeLoad: () => {
    /** Check role permission or others to navigate other pages */
    throw redirect({
      to: ROUTES.DASHBOARD,
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return null;
}
