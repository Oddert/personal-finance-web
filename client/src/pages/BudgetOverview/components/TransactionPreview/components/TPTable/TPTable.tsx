import { FC, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { ColumnDef } from '@tanstack/react-table';

import { Transaction } from '../../../../../../types/Transaction';

import { LOCALE } from '../../../../../../constants/appConstants';

import { getTransactionsOrderedByDate } from '../../../../../../redux/selectors/transactionsSelectors';

import { useAppSelector } from '../../../../../../hooks/ReduxHookWrappers';

import { addCurrencySymbol } from '../../../../../../utils/transactionUtils';

import Table from '../../../../../../components/Table';

import { IProps } from './TPTable.types';
import { CircularProgress } from '@mui/material';

dayjs.extend(localizedFormat);

const TPTable: FC<IProps> = ({
	categoryId,
	endDate,
	startDate,
}) => {
    const [loading, setLoading] = useState(true);
	const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

	const transactions = useAppSelector(getTransactionsOrderedByDate);
	
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
    }, [categoryId, endDate, startDate, transactions]);

	if (loading) {
		return <CircularProgress />;
	}
	return <Table columns={columns} data={filteredTransactions} />
}

export default TPTable
