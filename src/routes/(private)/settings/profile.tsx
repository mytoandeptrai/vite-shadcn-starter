import { ProfileContainer } from '@/modules/settings/profile';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(private)/settings/profile')({
  component: ProfileContainer,
});
