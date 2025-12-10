import { ROUTES } from '@/constant';
import { ActiveContainer } from '@/modules/auth/active';
import { createFileRoute, redirect } from '@tanstack/react-router';
import z from 'zod';

const verifySearchSchema = z.object({
  email: z.string().optional(),
  code: z.number().optional(),
  to: z.string().optional(),
});

export const Route = createFileRoute('/(auth)/active')({
  validateSearch: (search) => verifySearchSchema.parse(search),
  beforeLoad: ({ search }) => {
    const email = search?.email;
    const code = search?.code;
    const to = search?.to;
    if (!email || !code || !to) {
      throw redirect({
        to: ROUTES.LOGIN,
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { email, code, to } = Route.useSearch();
  return <ActiveContainer email={email} code={code} to={to} />;
}
