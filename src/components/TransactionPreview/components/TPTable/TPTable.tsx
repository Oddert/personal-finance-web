import { FC, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { ColumnDef } from '@tanstack/react-table';
import { CircularProgress } from '@mui/material';

import type { Transaction } from '../../../../types/Transaction.d';

import { LOCALE } from '../../../../constants/appConstants';

import { getTransactionsOrderedByDate } from '../../../../redux/selectors/transactionsSelectors';

import { meanValue, standardDeviation } from '../../../../utils/mathsUtils';

import { useAppSelector } from '../../../../hooks/ReduxHookWrappers';

import Table from '../../../Table';

import { addCurrencySymbol, debitCell } from './TPTableUtils';
import type { IProps, TransactionExtended } from './TPTable.types';

dayjs.extend(localizedFormat);

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

    const transactions = useAppSelector(getTransactionsOrderedByDate);

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
        let sDate = dayjs(startDate);
        const eDate = dayjs(endDate);

        const transactionList: Transaction[] = [];
        const values: number[] = [];

        while (sDate < eDate) {
            const year = sDate.year();
            const month = sDate.month();
            if (year in transactions && month in transactions[year]) {
                const transactionBlock = transactions[year][month].filter(
                    (transaction) => {
                        return transaction.category_id === categoryId;
                    },
                );
                transactionList.push(...transactionBlock);
                values.push(
                    ...transactionBlock.map((transaction) => transaction.debit),
                );
            }
            sDate = sDate.add(1, 'month').set('date', 10);
        }

        const mean = meanValue(values);
        const sd = standardDeviation(values);
        const high = mean + sd;

        const response: TransactionExtended[] = transactionList.map(
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
