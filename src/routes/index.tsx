import { createFileRoute } from '@tanstack/react-router';
import { HomeContainer } from '@/modules/home';

export const Route = createFileRoute('/')({
  component: HomeContainer,
});
