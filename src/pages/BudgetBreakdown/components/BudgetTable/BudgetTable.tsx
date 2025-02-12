import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();

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
                header: t('literals.Category'),
                accessorKey: 'categoryName',
            },
            {
                header: t('literals.Expected'),
                accessorKey: 'budget',
            },
            {
                header: t('literals.Actual'),
                accessorKey: 'spend',
            },
            {
                header: t('Budget.budgetTable.diffVal'),
                accessorKey: 'diffFloat',
                cell: (cell) => {
                    const value = cell.renderValue<number>();
                    return value === 0
                        ? '-'
                        : value > 0
                          ? `+ ${currencyLocaliser(value)}`
                          : `- ${currencyLocaliser(Math.abs(value))}`;
                },
            },
            {
                header: t('Budget.budgetTable.diffPc'),
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
                header: t('Budget.budgetTable.variance'),
                accessorKey: 'variance',
                cell: (cell) => {
                    const value = cell.renderValue<[number, number]>();
                    return `+${value[0]}% / -${value[1]}%`;
                },
            },
        ],
        [currencyLocaliser, t],
    );

    return <Table columns={columns} data={dataParsed} />;
};

export default BudgetTable;
