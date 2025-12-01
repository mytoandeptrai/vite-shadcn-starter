import type { Column } from '@tanstack/react-table'
import { DebouncedInput } from './debounced-input'

interface TableFilterProps {
	column: Column<any, unknown>
}

export function TableFilter({ column }: TableFilterProps) {
	const columnFilterValue = column.getFilterValue()

	return (
		<DebouncedInput
			type="text"
			value={(columnFilterValue ?? '') as string}
			onChange={(value) => column.setFilterValue(value)}
			placeholder="Search..."
			className="w-full px-2 py-1 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
		/>
	)
}

