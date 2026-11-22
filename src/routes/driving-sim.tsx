import { createFileRoute } from '@tanstack/react-router';
import { DrivingSimContainer } from '@/modules/driving-sim';

export const Route = createFileRoute('/driving-sim')({
  component: DrivingSimContainer,
});
