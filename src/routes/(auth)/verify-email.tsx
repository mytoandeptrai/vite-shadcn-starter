import { ROUTES } from '@/constant';
import { VerifyEmailContainer } from '@/modules/auth/verify-email';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';

const verifyEmailSearchSchema = z.object({
  email: z.string().optional(),
});

export const Route = createFileRoute('/(auth)/verify-email')({
  validateSearch: (search) => verifyEmailSearchSchema.parse(search),
  beforeLoad: ({ search }) => {
    const email = search?.email;
    if (!email) {
      throw redirect({
        to: ROUTES.LOGIN,
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { email } = Route.useSearch();
  return <VerifyEmailContainer email={email} />;
}
