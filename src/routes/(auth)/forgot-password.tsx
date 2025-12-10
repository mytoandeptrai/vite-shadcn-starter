import { ForgotPasswordContainer } from '@/modules/auth/forgot-password'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/forgot-password')({
  component: ForgotPasswordContainer,
})
