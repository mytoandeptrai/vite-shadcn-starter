import { RegisterContainer } from '@/modules/auth/register'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/register')({
  component: RegisterContainer,
})

