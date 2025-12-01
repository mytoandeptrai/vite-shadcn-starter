import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { useEffect } from 'react'
import { DebouncedInput } from './debounced-input'
import { TableFilter } from './table-filter'
import { useTableDemo } from '../hooks/use-table-demo'

export function TableDemo() {
	const {
		rerender,
		columnFilters,
		setColumnFilters,
		globalFilter,
		setGlobalFilter,
		columns,
		data,
		refreshData,
		fuzzyFilter,
	} = useTableDemo()

	const table = useReactTable({
		data,
		columns,
		filterFns: {
			fuzzy: fuzzyFilter,
		},
		state: {
			columnFilters,
			globalFilter,
		},
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: 'fuzzy',
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		debugTable: true,
		debugHeaders: true,
		debugColumns: false,
	})

	// Apply fuzzy sort if fullName column is being filtered
	useEffect(() => {
		if (table.getState().columnFilters[0]?.id === 'fullName') {
			if (table.getState().sorting[0]?.id !== 'fullName') {
				table.setSorting([{ id: 'fullName', desc: false }])
			}
		}
	}, [table.getState().columnFilters[0]?.id, table])

	return (
		<div className="min-h-screen bg-gray-900 p-6">
			<div>
				<DebouncedInput
					value={globalFilter ?? ''}
					onChange={(value) => setGlobalFilter(String(value))}
					className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
					placeholder="Search all columns..."
				/>
			</div>
			<div className="h-4" />
			<div className="overflow-x-auto rounded-lg border border-gray-700">
				<table className="w-full text-sm text-gray-200">
					<thead className="bg-gray-800 text-gray-100">
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<th
											key={header.id}
											colSpan={header.colSpan}
											className="px-4 py-3 text-left"
										>
											{header.isPlaceholder ? null : (
												<>
													<div
														{...{
															className: header.column.getCanSort()
																? 'cursor-pointer select-none hover:text-blue-400 transition-colors'
																: '',
															onClick: header.column.getToggleSortingHandler(),
														}}
													>
														{flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
														{{
															asc: ' 🔼',
															desc: ' 🔽',
														}[header.column.getIsSorted() as string] ?? null}
													</div>
													{header.column.getCanFilter() ? (
														<div className="mt-2">
															<TableFilter column={header.column} />
														</div>
													) : null}
												</>
											)}
										</th>
									)
								})}
							</tr>
						))}
					</thead>
					<tbody className="divide-y divide-gray-700">
						{table.getRowModel().rows.map((row) => {
							return (
								<tr
									key={row.id}
									className="hover:bg-gray-800 transition-colors"
								>
									{row.getVisibleCells().map((cell) => {
										return (
											<td key={cell.id} className="px-4 py-3">
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</td>
										)
									})}
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
			<div className="h-4" />
			<div className="flex flex-wrap items-center gap-2 text-gray-200">
				<button
					type="button"
					className="px-3 py-1 bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
					onClick={() => table.setPageIndex(0)}
					disabled={!table.getCanPreviousPage()}
				>
					{'<<'}
				</button>
				<button
					type="button"
					className="px-3 py-1 bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					{'<'}
				</button>
				<button
					type="button"
					className="px-3 py-1 bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					{'>'}
				</button>
				<button
					type="button"
					className="px-3 py-1 bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
					onClick={() => table.setPageIndex(table.getPageCount() - 1)}
					disabled={!table.getCanNextPage()}
				>
					{'>>'}
				</button>
				<span className="flex items-center gap-1">
					<div>Page</div>
					<strong>
						{table.getState().pagination.pageIndex + 1} of{' '}
						{table.getPageCount()}
					</strong>
				</span>
				<span className="flex items-center gap-1">
					| Go to page:
					<input
						type="number"
						defaultValue={table.getState().pagination.pageIndex + 1}
						onChange={(e) => {
							const page = e.target.value ? Number(e.target.value) - 1 : 0
							table.setPageIndex(page)
						}}
						className="w-16 px-2 py-1 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
					/>
				</span>
				<select
					value={table.getState().pagination.pageSize}
					onChange={(e) => {
						table.setPageSize(Number(e.target.value))
					}}
					className="px-2 py-1 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
				>
					{[10, 20, 30, 40, 50].map((pageSize) => (
						<option key={pageSize} value={pageSize}>
							Show {pageSize}
						</option>
					))}
				</select>
			</div>
			<div className="mt-4 text-gray-400">
				{table.getPrePaginationRowModel().rows.length} Rows
			</div>
			<div className="mt-4 flex gap-2">
				<button
					type="button"
					onClick={() => rerender()}
					className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
				>
					Force Rerender
				</button>
				<button
					type="button"
					onClick={() => refreshData()}
					className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
				>
					Refresh Data
				</button>
			</div>
			<pre className="mt-4 p-4 bg-gray-800 rounded-lg text-gray-300 overflow-auto">
				{JSON.stringify(
					{
						columnFilters: table.getState().columnFilters,
						globalFilter: table.getState().globalFilter,
					},
					null,
					2,
				)}
			</pre>
		</div>
	)
}

