import type { RankingInfo } from '@tanstack/match-sorter-utils'
import { compareItems, rankItem } from '@tanstack/match-sorter-utils'
import type {
	ColumnDef,
	ColumnFiltersState,
	FilterFn,
	SortingFn,
} from '@tanstack/react-table'
import { sortingFns } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import type { Person } from '@/data/demo-table-data'
import { makeData } from '@/data/demo-table-data'

declare module '@tanstack/react-table' {
	interface FilterFns {
		fuzzy: FilterFn<unknown>
	}
	interface FilterMeta {
		itemRank: RankingInfo
	}
}

// Define a custom fuzzy filter function
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
	const itemRank = rankItem(row.getValue(columnId), value)
	addMeta({
		itemRank,
	})
	return itemRank.passed
}

// Define a custom fuzzy sort function
const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
	let dir = 0
	if (rowA.columnFiltersMeta[columnId]) {
		dir = compareItems(
			rowA.columnFiltersMeta[columnId]?.itemRank!,
			rowB.columnFiltersMeta[columnId]?.itemRank!,
		)
	}
	return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

export function useTableDemo() {
	const rerender = useState({})[1]

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [globalFilter, setGlobalFilter] = useState('')

	const columns = useMemo<ColumnDef<Person, any>[]>(
		() => [
			{
				accessorKey: 'id',
				filterFn: 'equalsString' as const,
			},
			{
				accessorKey: 'firstName',
				cell: (info: any) => info.getValue(),
				filterFn: 'includesStringSensitive' as const,
			},
			{
				accessorFn: (row: Person) => row.lastName,
				id: 'lastName',
				cell: (info: any) => info.getValue(),
				header: 'Last Name',
				filterFn: 'includesString' as const,
			},
			{
				accessorFn: (row: Person) => `${row.firstName} ${row.lastName}`,
				id: 'fullName',
				header: 'Full Name',
				cell: (info: any) => info.getValue(),
				filterFn: 'fuzzy' as const,
				sortingFn: fuzzySort,
			},
		],
		[],
	)

	const [data, setData] = useState<Person[]>(() => makeData(5_000))
	const refreshData = () => setData(() => makeData(50_000))

	return {
		rerender: () => rerender({}),
		columnFilters,
		setColumnFilters,
		globalFilter,
		setGlobalFilter,
		columns,
		data,
		refreshData,
		fuzzyFilter,
	}
}

