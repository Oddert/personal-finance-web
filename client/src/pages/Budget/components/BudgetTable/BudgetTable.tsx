import { FC, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { IProps } from './BudgetTable.types';

import Table from '../../../../components/Table';

import { IBudgetDatum } from '../../Budget.types';

const BudgetTable: FC<IProps> = ({ data }) => {
    
    const columns = useMemo<ColumnDef<IBudgetDatum>[]>(() => [
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
            header: 'Difference (£)',
            accessorKey: 'diffInt',
            cell: (cell: any) => {
                const value = cell.renderValue();
                return value === 0 ? '-' : value > 0 ? `+ £${value}` : `- £${Math.abs(value)}`;
            }
        },
        {
            header: 'Difference (%)',
            accessorKey: 'diffPc',
            cell: (cell: any) => {
                const value = cell.renderValue();
                return value >= 0 ? `+${value}%` : `${value}%`;
            }
        },
    ], []);

    return <Table columns={columns} data={data} />
}

export default BudgetTable;
