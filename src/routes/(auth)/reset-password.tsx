import { ResetPasswordContainer } from '@/modules/auth';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)/reset-password')({
  component: ResetPasswordContainer,
});
