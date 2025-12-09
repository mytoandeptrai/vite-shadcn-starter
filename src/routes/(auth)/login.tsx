import LoginContainer from '@/modules/auth/login/containers/login-container'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/login')({
  component: LoginContainer,
})

