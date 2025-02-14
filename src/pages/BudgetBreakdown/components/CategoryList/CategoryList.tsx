import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { Box } from '@mui/material';

import type { ICategoryBDValue } from '../../../../types/Category.d';

import useLocalisedNumber from '../../../../hooks/useLocalisedNumber';

import Table from '../../../../components/Table';

import type { IProps } from './CategoryList.types';

const addCurrencySymbol = (cell: CellContext<ICategoryBDValue, unknown>) => {
    const value = cell.renderValue() as number;
    const { currencyLocaliser } = useLocalisedNumber();
    return (
        <Box sx={{ textAlign: 'right' }}>
            {isNaN(value) ? '-' : currencyLocaliser(value)}
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
    const { t } = useTranslation();

    const data = useMemo(
        () => Object.values(categoryBreakdown),
        [categoryBreakdown],
    );

    const columns = useMemo<ColumnDef<ICategoryBDValue>[]>(
        () => [
            {
                header: t('literals.Category'),
                accessorKey: 'label',
            },
            {
                header: t('literals.Amount'),
                accessorKey: 'value',
                cell: addCurrencySymbol,
            },
        ],
        [t],
    );

    return <Table columns={columns} data={data} />;
};

export default CategoryList;
