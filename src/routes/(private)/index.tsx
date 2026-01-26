import { ROUTES } from '@/constant';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/(private)/')({
  beforeLoad: ({ context }) => {
    const auth = context.auth;
    const to = auth.isAuthenticated ? ROUTES.DASHBOARD : ROUTES.GETTING_STARTED;
    throw redirect({
      to,
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return null;
}
