import { TransactionDetailContainer } from '@/modules/transaction-detail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(private)/transactions/$transactionId')({
  component: TransactionDetailContainer,
})

