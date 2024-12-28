import { FC, useMemo } from 'react';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { Box } from '@mui/material';

import { IProps } from './CategoryList.types';

import Table from '../../../../components/Table';

const addCurrencySymbol = (cell: CellContext<{ label: string, value: number }, unknown>) => {
    const value = cell.renderValue() as number;
    return (
        <Box sx={{ textAlign: 'right' }}>
            {
                isNaN(value)
                    ? '-'
                    : `£${value.toFixed(2)}`
            }
        </Box>
    )
}

const CategoryList: FC<IProps> = ({ categoryBreakdown }) => {
    const data = useMemo(() => Object.values(categoryBreakdown), [categoryBreakdown]);

    const columns = useMemo<ColumnDef<{
        value: number;
        label: string;
    }>[]>(() => [
        {
            header: 'Category',
            accessorKey: 'label'
        },
        {
            header: 'Amount',
            accessorKey: 'value',
            cell: addCurrencySymbol,
        },
    ], [])

    return <Table columns={columns} data={data} />
};

export default CategoryList;
