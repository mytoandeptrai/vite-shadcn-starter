import { DeveloperContainer } from '@/modules/developer';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(private)/developer')({
  component: DeveloperContainer,
});
