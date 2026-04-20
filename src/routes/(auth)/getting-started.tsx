import { createFileRoute } from '@tanstack/react-router';
import { GettingStartedContainer } from '@/modules/getting-started';

export const Route = createFileRoute('/(auth)/getting-started')({
  component: GettingStartedContainer,
});
