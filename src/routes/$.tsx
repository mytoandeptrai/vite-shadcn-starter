import NotFoundPage from '@/components/ui/not-found';
import { createFileRoute } from '@tanstack/react-router';

// Catch-all route for any unmatched paths
export const Route = createFileRoute('/$')({
  component: NotFoundPage,
});
