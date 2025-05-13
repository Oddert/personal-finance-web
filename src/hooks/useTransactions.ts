import { useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import type { ITransaction } from '../types/Transaction.d';

import {
    getTransactionsEndDate,
    getTransactionsOrderedByDate,
    getTransactionsStartDate,
} from '../redux/selectors/transactionsSelectors';
import { getIsAuthenticated } from '../redux/selectors/authSelectors';

import { conditionallyRefreshTransactions } from '../redux/thunks/transactionThunks';

import { useAppDispatch, useAppSelector } from './ReduxHookWrappers';

type IMultiDate = string | Date | Dayjs | number;

dayjs.extend(localizedFormat);

/**
 * Provides one of a set of pre-set content widths depending on window width.
 *
 * Intended to provide a standard chart width size, rather than using percentages, with upper and lower limits.
 * @category Hooks
 * @subcategory useContentWidth
 */
const useTransactions = (startDate?: IMultiDate, endDate?: IMultiDate) => {
    const dispatch = useAppDispatch();

    const allTransactions = useAppSelector(getTransactionsOrderedByDate);
    const rangeStartDate = useAppSelector(getTransactionsStartDate);
    const rangeEndDate = useAppSelector(getTransactionsEndDate);
    const isAuthenticated = useAppSelector(getIsAuthenticated);

    const fromDate = useMemo(
        () => dayjs(startDate || rangeStartDate),
        [startDate, rangeStartDate],
    );

    const toDate = useMemo(
        () => dayjs(endDate || rangeEndDate),
        [startDate, rangeStartDate],
    );

    const transactions = useMemo(() => {
        let sDate = dayjs(fromDate);
        const eDate = dayjs(toDate);

        const transactionList: ITransaction[] = [];
        const values: number[] = [];

        dispatch(
            conditionallyRefreshTransactions(
                fromDate.valueOf(),
                toDate.valueOf(),
            ),
        );

        while (sDate < eDate) {
            const year = sDate.year();
            const month = sDate.month();
            if (year in allTransactions && month in allTransactions[year]) {
                const transactionBlock = allTransactions[year][month];
                transactionList.push(...transactionBlock);
                values.push(
                    ...transactionBlock.map((transaction) => transaction.debit),
                );
            }
            sDate = sDate.add(1, 'month').set('date', 10);
        }

        return transactionList;
    }, [allTransactions, fromDate, isAuthenticated, toDate]);

    return { fromDate, toDate, transactions };
};

export default useTransactions;
