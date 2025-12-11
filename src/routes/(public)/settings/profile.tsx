import { ProfileContainer } from '@/modules/settings/profile'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/settings/profile')({
  component: ProfileContainer,
})

