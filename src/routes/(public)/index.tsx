import { HomeContainer } from '@/modules/home'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/')({
  component: HomeContainer,
})

