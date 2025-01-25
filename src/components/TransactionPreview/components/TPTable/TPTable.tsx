import { FC, useEffect, useMemo, useState } from 'react';

import { ColumnDef } from '@tanstack/react-table';
import { CircularProgress } from '@mui/material';

import { LOCALE } from '../../../../constants/appConstants';

import { meanValue, standardDeviation } from '../../../../utils/mathsUtils';

import useTransactions from '../../../../hooks/useTransactions';

import Table from '../../../Table';

import { addCurrencySymbol, debitCell } from './TPTableUtils';
import type { IProps, TransactionExtended } from './TPTable.types';

/**
 * Table component which renders the transactions.
 * @category Components
 * @subcategory Transaction Preview
 * @component
 * @param props.categoryId The category of transactions to pull.
 * @param props.endDate The end date to pull transactions from.
 * @param props.startDate The start date to pull transactions from.
 */
const TPTable: FC<IProps> = ({ categoryId, endDate, startDate }) => {
    const [loading, setLoading] = useState(true);
    const [filteredTransactions, setFilteredTransactions] = useState<
        TransactionExtended[]
    >([]);

    const { transactions } = useTransactions(startDate, endDate);

    const columns = useMemo<ColumnDef<TransactionExtended>[]>(
        () => [
            {
                header: 'Date',
                accessorKey: 'date',
                cell: (cell) => {
                    const value = cell.renderValue();
                    if (typeof value === 'number') {
                        return new Date(value).toLocaleDateString(LOCALE);
                    }
                    return value;
                },
            },
            {
                header: 'Description',
                accessorKey: 'description',
            },
            {
                header: 'Out',
                accessorKey: 'debit',
                cell: debitCell,
            },
            {
                header: 'In',
                accessorKey: 'credit',
                cell: addCurrencySymbol,
            },
            {
                header: '',
                accessorKey: 'outOfBounds',
            },
            // {
            //     header: 'Ballance',
            //     accessorKey: 'ballance',
            //     cell: addCurrencySymbol,
            // },
            // {
            //     header: 'Category',
            //     accessorKey: 'assignedCategory',
            //     cell: (cell) => {
            //         const value: Category | unknown = cell.renderValue()
            //         if (value && typeof value === 'object' && 'label' in value) {
            //             return value.label
            //         }
            //         return '- uncategorised -'
            //     }
            // }
        ],
        [],
    );

    useEffect(() => {
        const transactionsFiltered = transactions.filter(
            (transaction) => transaction.category_id === categoryId,
        );
        const values: number[] = transactionsFiltered.map(
            (transaction) => transaction.debit,
        );

        const mean = meanValue(values);
        const sd = standardDeviation(values);
        const high = mean + sd;

        const response: TransactionExtended[] = transactionsFiltered.map(
            (transaction) => ({
                ...transaction,
                outOfBounds: transaction.debit > high,
            }),
        );

        setFilteredTransactions(response.reverse());
        setLoading(false);
    }, [categoryId, endDate, startDate, transactions]);

    if (loading) {
        return <CircularProgress />;
    }
    return (
        <Table
            columns={columns}
            columnVisibility={{ outOfBounds: false }}
            data={filteredTransactions}
        />
    );
};

export default TPTable;
