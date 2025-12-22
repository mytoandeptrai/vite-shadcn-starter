import { ROUTES } from '@/constant';
import { ActiveContainer } from '@/modules/auth/active';
import { createFileRoute, redirect } from '@tanstack/react-router';
import z from 'zod';

const verifySearchSchema = z.object({
  token: z.string().optional(),
});

export const Route = createFileRoute('/(auth)/active')({
  validateSearch: (search) => verifySearchSchema.parse(search),
  beforeLoad: ({ search }) => {
    const token = search?.token;
    if (!token) {
      throw redirect({
        to: ROUTES.LOGIN,
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { token } = Route.useSearch();
  return <ActiveContainer token={token} />;
}
