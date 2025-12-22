import { DashboardContainer } from '@/modules/dashboard';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(private)/dashboard')({
  component: DashboardContainer,
});
