import { BalanceContainer } from '@/modules/balance';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(private)/balance')({
  component: BalanceContainer,
});
