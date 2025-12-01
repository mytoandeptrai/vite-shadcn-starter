import { createFileRoute } from '@tanstack/react-router'
import { TableDemoContainer } from '@/modules/demo-table'

export const Route = createFileRoute('/demo/table')({
	component: TableDemoContainer,
})
