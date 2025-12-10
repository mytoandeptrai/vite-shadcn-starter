import { VerifiedEmailContainer } from '@/modules/auth/verified-email'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/verified-email')({
  component: VerifiedEmailContainer,
})
