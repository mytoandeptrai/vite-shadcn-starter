import { createFileRoute } from '@tanstack/react-router';
import { DrivingSimContainer } from '@/modules/driving-sim';

export const Route = createFileRoute('/')({
  component: DrivingSimContainer,
});
