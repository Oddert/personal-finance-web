import { FC, useMemo } from 'react';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { Box } from '@mui/material';

import type { ICategoryBDValue } from '../../../../types/Category.d';

import { CURRENCY_SYMBOL } from '../../../../constants/appConstants';

import Table from '../../../../components/Table';

import type { IProps } from './CategoryList.types';

const addCurrencySymbol = (cell: CellContext<ICategoryBDValue, unknown>) => {
    const value = cell.renderValue() as number;
    return (
        <Box sx={{ textAlign: 'right' }}>
            {isNaN(value) ? '-' : `${CURRENCY_SYMBOL}${value.toFixed(2)}`}
        </Box>
    );
};

/**
 * Simple table component to display all Category totals.
 *
 * @category Pages
 * @subcategory Budget Breakdown
 * @component
 * @deprecated {@link BudgetPercentageChart} serves the same purpose.
 */
const CategoryList: FC<IProps> = ({ categoryBreakdown }) => {
    const data = useMemo(
        () => Object.values(categoryBreakdown),
        [categoryBreakdown],
    );

    const columns = useMemo<ColumnDef<ICategoryBDValue>[]>(
        () => [
            {
                header: 'Category',
                accessorKey: 'label',
            },
            {
                header: 'Amount',
                accessorKey: 'value',
                cell: addCurrencySymbol,
            },
        ],
        [],
    );

    return <Table columns={columns} data={data} />;
};

export default CategoryList;
