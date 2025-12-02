import { createFileRoute } from '@tanstack/react-router';
import { DemoFormContainer } from '@/modules/demo-form';

export const Route = createFileRoute('/demo/form')({
  component: DemoFormContainer,
});
