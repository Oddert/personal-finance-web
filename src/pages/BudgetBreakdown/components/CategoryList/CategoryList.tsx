import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';

import type { IProps } from './CategoryList.types';
import type { ICategoryBDValue } from '../../../../types/Category.d';
import type { CellContext, ColumnDef } from '@tanstack/react-table';

import Table from '../../../../components/Table';
import useLocalisedNumber from '../../../../hooks/useLocalisedNumber';

const addCurrencySymbol = (cell: CellContext<ICategoryBDValue, unknown>) => {
    const value = cell.renderValue() as number;
    // eslint-disable-next-line react-hooks/rules-of-hooks
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

// eslint-disable-next-line @typescript-eslint/no-deprecated
export default CategoryList;
