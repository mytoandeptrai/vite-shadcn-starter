import { createFileRoute } from '@tanstack/react-router';
import { LandingContainer } from '@/modules/landing';

export const Route = createFileRoute('/landing')({
  component: LandingContainer,
});
