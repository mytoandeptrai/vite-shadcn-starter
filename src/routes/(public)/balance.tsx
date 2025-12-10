import { BalanceContainer } from '@/modules/balance'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/balance')({
  component: BalanceContainer,
})

