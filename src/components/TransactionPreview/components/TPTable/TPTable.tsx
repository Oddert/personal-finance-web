import { FC, useEffect, useMemo, useState } from 'react';

import { ColumnDef } from '@tanstack/react-table';
import { CircularProgress } from '@mui/material';

import { getActiveLanguageCode } from '../../../../redux/selectors/profileSelectors';

import { meanValue, standardDeviation } from '../../../../utils/mathsUtils';

import { useAppSelector } from '../../../../hooks/ReduxHookWrappers';
import useTransactions from '../../../../hooks/useTransactions';

import Table from '../../../Table';

import { addCurrencySymbol, debitCell } from './TPTableUtils';
import type { IProps, ITransactionExtended } from './TPTable.types';

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
        ITransactionExtended[]
    >([]);

    const language = useAppSelector(getActiveLanguageCode);

    const { transactions } = useTransactions(startDate, endDate);

    const columns = useMemo<ColumnDef<ITransactionExtended>[]>(
        () => [
            {
                header: 'Date',
                accessorKey: 'date',
                cell: (cell) => {
                    const value = cell.renderValue();
                    if (typeof value === 'number') {
                        return new Date(value).toLocaleDateString(language);
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
        [language],
    );

    useEffect(() => {
        const transactionsFiltered = transactions.filter(
            (transaction) => transaction.categoryId === categoryId,
        );
        const values: number[] = transactionsFiltered.map(
            (transaction) => transaction.debit,
        );

        const mean = meanValue(values);
        const sd = standardDeviation(values);
        const high = mean + sd;

        const response: ITransactionExtended[] = transactionsFiltered.map(
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
