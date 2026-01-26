import NotFoundPage from '@/components/ui/not-found';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/404')({
  component: NotFoundPage,
});
