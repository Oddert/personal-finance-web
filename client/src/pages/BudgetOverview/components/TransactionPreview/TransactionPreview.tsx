import { FC, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { ColumnDef } from '@tanstack/react-table';
import { Button, CircularProgress, Popover } from '@mui/material';

import { LOCALE } from '../../../../constants/appConstants';

import { Transaction } from '../../../../types/Transaction';

import { getTransactionsOrderedByDate } from '../../../../redux/selectors/transactionsSelectors';

import { addCurrencySymbol } from '../../../../utils/transactionUtils';

import { useAppSelector } from '../../../../hooks/ReduxHookWrappers';

import Table from '../../../../components/Table';

import { IProps } from './TransactionPreview.types';

dayjs.extend(localizedFormat);

const TransactionPreview: FC<IProps> = ({
    anchorEl,
    categoryId,
    clearAnchorEl,
    endDate,
    startDate,
}) => {
    const transactions = useAppSelector(getTransactionsOrderedByDate);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let sDate = dayjs(startDate);
        const eDate = dayjs(endDate);

        const response: Transaction[] = [];

        while (sDate < eDate) {
            const year = sDate.year()
            const month = sDate.month()
            if (year in transactions && month in transactions[year]) {
                const transactionBlock = transactions[year][month].filter((transaction) => {
                    return transaction.category_id === categoryId;
                });
                response.push(...transactionBlock);
            }
            sDate = sDate.add(1, 'month').set('date', 10)
        }

        setFilteredTransactions(response);
        setLoading(false);
    }, [categoryId, endDate, transactions, startDate]);


    const columns = useMemo<ColumnDef<Transaction>[]>(() => [
        {
            header: 'Date',
            accessorKey: 'date',
            cell: (cell) => {
                const value = cell.renderValue()
                if (typeof value === 'number') {
                    return new Date(value).toLocaleDateString(LOCALE)
                }
                return value
            }
        },
        {
            header: 'Description',
            accessorKey: 'description'
        },
        {
            header: 'Out',
            accessorKey: 'debit',
            cell: addCurrencySymbol,
        },
        {
            header: 'In',
            accessorKey: 'credit',
            cell: addCurrencySymbol,
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
    ], []);

    const handleClose = () => {
        setLoading(true);
        clearAnchorEl();
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <Button onClick={handleClose}>Close</Button>
            {loading ? (
                <CircularProgress />
            ) : (
                <Table columns={columns} data={filteredTransactions} />
            )}
        </Popover>
    )
}

export default TransactionPreview;
