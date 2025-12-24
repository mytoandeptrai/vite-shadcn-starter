import { MerchantDetailsContainer } from '@/modules/merchant-detail';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(private)/merchants/$merchantId')({
  component: MerchantDetailsContainer,
});
