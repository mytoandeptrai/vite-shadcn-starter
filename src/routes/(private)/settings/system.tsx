import { SystemContainer } from '@/modules/settings/system';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(private)/settings/system')({
  component: SystemContainer,
});
