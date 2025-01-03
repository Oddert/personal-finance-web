import { FC, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { IProps } from './BudgetTable.types';

import Table from '../../../../components/Table';

import { IBudgetDatum } from '../../Budget.types';
import { Typography } from '@mui/material';

type IBudgetDatumTable = IBudgetDatum & {
    under: boolean
    over: boolean
}

const BudgetTable: FC<IProps> = ({ data }) => {

    const dataParsed: IBudgetDatumTable[] = useMemo(() => 
        data.map((datum) => ({
            ...datum,
            over: false,
            under: false,
        })),
        [data],
    )
    
    const columns = useMemo<ColumnDef<IBudgetDatumTable>[]>(() => [
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
            accessorKey: 'diffFloat',
            cell: (cell) => {
                const value = cell.renderValue<number>();
                return value === 0 ? '-' : value > 0 ? `+ £${value}` : `- £${Math.abs(value)}`;
            }
        },
        {
            header: 'Difference (%)',
            accessorKey: 'diffPc',
            cell: (cell) => {
                const value = cell.renderValue<number>();
                const ctx = cell.row.getValue<[number, number]>('variance');
                return (
                    <Typography color={ctx[1] && value >= ctx[1] ? 'error' : 'white'}>
                        {value >= 0 ? `+${value}%` : `${value}%`}
                    </Typography>
                )
            }
        },
        {
            header: 'Variance low / high (%)',
            accessorKey: 'variance',
            cell: (cell) => {
                const value = cell.renderValue<[number, number]>();
                return `+${value[0]}% / -${value[1]}%`
            }
        },
    ], []);

    return <Table columns={columns} data={dataParsed} />
}

export default BudgetTable;
