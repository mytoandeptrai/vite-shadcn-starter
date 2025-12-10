import { createFileRoute } from '@tanstack/react-router';
import { TanStackQueryDemoContainer } from '@/modules/demo-tanstack-query';

export const Route = createFileRoute('/demo/tanstack-query')({
  component: TanStackQueryDemoContainer,
});
