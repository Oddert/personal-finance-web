import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

import {
    Box,
    Table as MuiTable,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from '@mui/material'

interface ReactTableProps<TData> {
    data: TData[]
    columns: ColumnDef<TData>[]
    compact?: boolean
	columnVisibility?: { [column: string]: boolean }
}

/**
 * Re-usable table component based on react-table.
 * @category Components
 * @subcategory Table
 * @component
 * @param props.data The data to display.
 * @param props.columns List of Column Definitions
 * @param props.compact If true, the row styling is more condensed.
 * @param props.columnVisibility List of columns to hide.
 */
const Table = <TData extends object>({ data, columns, compact, columnVisibility }: ReactTableProps<TData>) => {	  
    const {
        getHeaderGroups,
        getRowModel,
    } = useReactTable<TData>({
        columns,
        enableGrouping: false,
        data,
        getCoreRowModel: getCoreRowModel(),
		initialState: {
			columnVisibility,
		},
    })

    return (
        <Box>
            <MuiTable>
                <TableHead>
                    {getHeaderGroups().map((headerGroup, headerGroupIdx) => (
                        <TableRow key={headerGroupIdx}>
                            {headerGroup.headers.map((header, headerIdx) => (
                                <TableCell key={headerIdx} sx={{ padding: compact ? '8px' : '16px' }}>
                                    {
                                        header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )
                                    }
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody>
                    {getRowModel().rows.map((row, rowIdx) => (
                        <TableRow key={rowIdx}>
                            {row.getVisibleCells().map((cell, cellIdx) => (
                                <TableCell key={cellIdx} sx={{ padding: compact ? '8px' : '16px' }}>
                                    {
                                        flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )
                                    }
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </MuiTable>
        </Box>
    )
}

export default Table
