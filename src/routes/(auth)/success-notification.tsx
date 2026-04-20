import { SuccessNotificationContainer } from '@/modules/auth';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)/success-notification')({
  component: SuccessNotificationContainer,
});
