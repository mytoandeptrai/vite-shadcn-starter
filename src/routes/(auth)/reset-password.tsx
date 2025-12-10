import { ROUTES } from '@/constant';
import { ResetPasswordContainer } from '@/modules/auth/reset-password';
import { createFileRoute, redirect } from '@tanstack/react-router';
import z from 'zod';

const verifySearchSchema = z.object({
  email: z.string().optional(),
  code: z.number().optional(),
});

export const Route = createFileRoute('/(auth)/reset-password')({
  validateSearch: (search) => verifySearchSchema.parse(search),
  beforeLoad: ({ search }) => {
    const email = search?.email;
    const code = search?.code;
    if (!email || !code) {
      throw redirect({
        to: ROUTES.LOGIN,
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { email, code } = Route.useSearch();
  return <ResetPasswordContainer email={email} code={code} />;
}
