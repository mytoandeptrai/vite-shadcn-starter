import { DeveloperContainer } from '@/modules/developer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/developer')({
  component: DeveloperContainer,
})

