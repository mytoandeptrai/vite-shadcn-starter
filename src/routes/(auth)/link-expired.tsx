import { ROUTES } from '@/constant';
import { LinkExpiredContainer } from '@/modules/auth/link-expired';
import { createFileRoute, redirect } from '@tanstack/react-router';
import z from 'zod';

const verifyEmailSearchSchema = z.object({
  email: z.string().optional(),
});

export const Route = createFileRoute('/(auth)/link-expired')({
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
  return <LinkExpiredContainer email={email} />;
}
