import { FC, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { Typography } from '@mui/material';

import useLocalisedNumber from '../../../../hooks/useLocalisedNumber';

import Table from '../../../../components/Table';

import type { IBudgetDatumTable, IProps } from './BudgetTable.types';

/**
 * Displays all transactions within the selected range.
 *
 * Highlights transactions which fall outwith the specified accepted variance (are out of bounds).
 * @category Pages
 * @subcategory Budget Breakdown
 * @component
 */
const BudgetTable: FC<IProps> = ({ data }) => {
    const dataParsed: IBudgetDatumTable[] = useMemo(
        () =>
            data.map((datum) => ({
                ...datum,
                over: false,
                under: false,
            })),
        [data],
    );

    const { currencyLocaliser } = useLocalisedNumber();

    const columns = useMemo<ColumnDef<IBudgetDatumTable>[]>(
        () => [
            {
                header: 'Category',
                accessorKey: 'categoryName',
            },
            {
                header: 'Expected',
                accessorKey: 'budget',
            },
            {
                header: 'Actual',
                accessorKey: 'spend',
            },
            {
                header: `Difference (val)`,
                accessorKey: 'diffFloat',
                cell: (cell) => {
                    const value = cell.renderValue<number>();
                    return value === 0
                        ? '-'
                        : value > 0
                          ? `+ ${currencyLocaliser(value)}${value}`
                          : `- ${currencyLocaliser(Math.abs(value))}`;
                },
            },
            {
                header: 'Difference (%)',
                accessorKey: 'diffPc',
                cell: (cell) => {
                    const value = cell.renderValue<number>();
                    const ctx = cell.row.getValue<[number, number]>('variance');
                    return (
                        <Typography
                            color={
                                ctx[1] && value >= ctx[1] ? 'error' : 'white'
                            }
                        >
                            {value >= 0 ? `+${value}%` : `${value}%`}
                        </Typography>
                    );
                },
            },
            {
                header: 'Variance low / high (%)',
                accessorKey: 'variance',
                cell: (cell) => {
                    const value = cell.renderValue<[number, number]>();
                    return `+${value[0]}% / -${value[1]}%`;
                },
            },
        ],
        [currencyLocaliser],
    );

    return <Table columns={columns} data={dataParsed} />;
};

export default BudgetTable;
