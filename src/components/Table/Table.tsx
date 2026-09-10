import { useState } from 'react';

import {
    Box,
    Table as MuiTable,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
} from '@mui/material';

import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';

import type { ColumnDef, PaginationState } from '@tanstack/react-table';

interface ReactTableProps<TData> {
    columns: ColumnDef<TData>[];
    columnVisibility?: Record<string, boolean>;
    compact?: boolean;
    data: TData[];
    enablePagination?: boolean;
    size?: 'small' | 'medium';
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
 * @param props.enablePagination If true, pagination controls are displayed.
 */
const Table = <TData extends object>({
    data,
    columns,
    compact,
    columnVisibility,
    enablePagination = true,
    size = 'medium',
}: ReactTableProps<TData>) => {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 50,
    });

    // eslint-disable-next-line react-hooks/incompatible-library
    const { getHeaderGroups, getRowModel } = useReactTable<TData>({
        columns,
        enableGrouping: false,
        data,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: enablePagination
            ? getPaginationRowModel()
            : undefined,
        onPaginationChange: setPagination,
        state: {
            ...(enablePagination && { pagination }),
        },
        initialState: {
            columnVisibility,
        },
    });

    const paginationComponent = enablePagination ? (
        <TablePagination
            component='div'
            count={data.length}
            page={pagination.pageIndex}
            onPageChange={(_, newPage) => {
                setPagination((prev) => ({
                    ...prev,
                    pageIndex: newPage,
                }));
            }}
            rowsPerPage={pagination.pageSize}
            onRowsPerPageChange={(e) => {
                setPagination({
                    pageIndex: 0,
                    pageSize: parseInt(e.target.value, 10),
                });
            }}
            rowsPerPageOptions={[10, 30, 50, 100, 150, 200, 500]}
        />
    ) : null;

    return (
        <Box>
            {paginationComponent}
            <MuiTable size={size}>
                <TableHead>
                    {getHeaderGroups().map((headerGroup, headerGroupIdx) => (
                        <TableRow key={headerGroupIdx}>
                            {headerGroup.headers.map((header, headerIdx) => (
                                <TableCell
                                    key={headerIdx}
                                    sx={{ padding: compact ? '8px' : '16px' }}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext(),
                                          )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody>
                    {getRowModel().rows.map((row, rowIdx) => (
                        <TableRow key={rowIdx}>
                            {row.getVisibleCells().map((cell, cellIdx) => (
                                <TableCell
                                    key={cellIdx}
                                    sx={{ padding: compact ? '8px' : '16px' }}
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </MuiTable>
            {paginationComponent}
        </Box>
    );
};

export default Table;
