import { LoginContainer } from '@/modules/auth';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)/login')({
  component: LoginContainer,
});
